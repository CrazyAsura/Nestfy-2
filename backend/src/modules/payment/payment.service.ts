import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import { OrderItem, OrderItemDocument } from '../order-item/schemas/order-item.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { NotificationService } from '../notification/notification.service';
import { OrderStatus, PaymentStatus } from '../../constants/enums';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItemDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      this.logger.error('STRIPE_SECRET_KEY is not defined. Please check your .env file or deployment environment variables.');
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  async createCheckoutSession(createCheckoutSessionDto: CreateCheckoutSessionDto, userId: string) {
    const { items: inputItems, paymentMethod } = createCheckoutSessionDto;

    // 1. Validar e buscar preços reais no banco de dados
    const validatedItems = await Promise.all(
      inputItems.map(async (item) => {
        const product = await this.productModel.findById(item.id);
        if (!product) {
          throw new NotFoundException(`Produto ${item.name} não encontrado`);
        }
        
        const realPrice = product.discountPrice || product.price;
        
        // Cálculo de Impostos
        const icmsAmount = (realPrice * (product.icms || 0)) / 100;
        const ipiAmount = (realPrice * (product.ipi || 0)) / 100;
        const pisAmount = (realPrice * (product.pis || 0)) / 100;
        const cofinsAmount = (realPrice * (product.cofins || 0)) / 100;
        const totalTaxAmount = icmsAmount + ipiAmount + pisAmount + cofinsAmount;

        return {
          id: product.id,
          name: product.name,
          price: realPrice,
          quantity: item.quantity,
          image: product.images?.[0]?.url || product.imageUrl || '',
          taxes: {
            icmsAmount,
            ipiAmount,
            pisAmount,
            cofinsAmount,
            totalTaxAmount,
          }
        };
      })
    );

    const lineItems = validatedItems.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    if (paymentMethod === 'card') {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        shipping_address_collection: {
          allowed_countries: ['BR'], // Permitir apenas Brasil, ou adicione outros
        },
        phone_number_collection: {
          enabled: true,
        },
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: {
          userId,
          items: JSON.stringify(validatedItems.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            taxes: item.taxes,
          })))
        },
      });

      return { sessionId: session.id, url: session.url };
    } else {
      // Para PIX e Boleto, criamos o pedido como PENDING
      const totalAmount = validatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const totalTaxAmount = validatedItems.reduce((acc, item) => acc + (item.taxes.totalTaxAmount * item.quantity), 0);
      
      const newOrder = new this.orderModel({
        userId,
        totalAmount,
        totalTaxAmount,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: paymentMethod.toUpperCase(),
        items: validatedItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          icmsAmount: item.taxes.icmsAmount,
          ipiAmount: item.taxes.ipiAmount,
          pisAmount: item.taxes.pisAmount,
          cofinsAmount: item.taxes.cofinsAmount,
          totalTaxAmount: item.taxes.totalTaxAmount,
        }))
      });

      const savedOrder = await newOrder.save();
      
      for (const item of validatedItems) {
        const orderItem = new this.orderItemModel({
          orderId: savedOrder._id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          icmsAmount: item.taxes.icmsAmount,
          ipiAmount: item.taxes.ipiAmount,
          pisAmount: item.taxes.pisAmount,
          cofinsAmount: item.taxes.cofinsAmount,
          totalTaxAmount: item.taxes.totalTaxAmount,
        });
        await orderItem.save();
      }

      await this.notificationService.create(
        userId,
        'Pedido Recebido',
        `Seu pedido #${savedOrder._id} foi recebido e aguarda pagamento via ${paymentMethod.toUpperCase()}.`,
        'ORDER_PENDING',
      );

      return { orderId: savedOrder._id, status: 'PENDING' };
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      this.logger.log(`Payment completed for session ${session.id}`);
      
      const userId = session.metadata?.userId;
      const itemsMetadata = session.metadata?.items;
      
      if (!userId || !itemsMetadata) {
        this.logger.error('Missing metadata in Stripe session');
        return;
      }

      const items = JSON.parse(itemsMetadata);
      const totalAmount = (session.amount_total || 0) / 100;
      const totalTaxAmount = items.reduce((acc: number, item: any) => acc + (item.taxes?.totalTaxAmount * item.quantity || 0), 0);

      // Extrair endereço de entrega do Stripe
      const shippingDetails = (session as any).shipping_details;
      const address = shippingDetails?.address;
      const formattedAddress = address 
        ? `${address.line1}, ${address.line2 || ''}, ${address.city}, ${address.state}, ${address.postal_code}, ${address.country}`
        : 'Endereço não fornecido';

      const customerPhone = (session as any).customer_details?.phone || '';

      // 1. Criar o pedido no banco de dados
      const newOrder = new this.orderModel({
        userId,
        totalAmount,
        totalTaxAmount,
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.COMPLETED,
        paymentMethod: 'CARD',
        orderNumber: `ORD-${Date.now()}`,
        shippingAddress: formattedAddress,
        customerPhone: customerPhone,
        stripeSessionId: session.id,
      });

      const savedOrder = await newOrder.save();

      const orderItems = items.map((item: any) => ({
        orderId: (savedOrder as any)._id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        icmsAmount: item.taxes?.icmsAmount || 0,
        ipiAmount: item.taxes?.ipiAmount || 0,
        pisAmount: item.taxes?.pisAmount || 0,
        cofinsAmount: item.taxes?.cofinsAmount || 0,
        totalTaxAmount: item.taxes?.totalTaxAmount || 0,
      }));

      await this.orderItemModel.insertMany(orderItems);
      const order = savedOrder;

      // 3. Atualizar estoque dos produtos
      for (const item of items) {
        await this.productModel.findByIdAndUpdate(item.id, {
          $inc: { stock: -item.quantity }
        });
      }

      // 4. Criar uma notificação para o usuário
      await this.notificationService.create(
        userId,
        'Pedido Confirmado!',
        `Seu pedido #${order.orderNumber} foi processado com sucesso e está sendo preparado para o envio.`,
        'SUCCESS'
      );
    }

    return { received: true };
  }

  async confirmPayment(orderId: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    if (order.paymentStatus === PaymentStatus.COMPLETED) {
      return order;
    }

    order.paymentStatus = PaymentStatus.COMPLETED;
    order.status = OrderStatus.PROCESSING;
    order.orderNumber = order.orderNumber || `ORD-${Date.now()}`;
    
    const savedOrder = await order.save();

    // Atualizar estoque dos produtos
    const items = (order as any).items;
    return savedOrder;
  }

  async getSessionStatus(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      const order = await this.orderModel.findOne({ stripeSessionId: sessionId });

      return {
        status: session.payment_status,
        orderStatus: order ? order.status : 'PENDING',
        orderNumber: order ? order.orderNumber : null,
      };
    } catch (error) {
      this.logger.error(`Error retrieving Stripe session: ${error.message}`);
      throw new Error('Erro ao buscar status da sessão de pagamento');
    }
  }
}
