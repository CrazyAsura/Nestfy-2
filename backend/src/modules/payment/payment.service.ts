import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import { OrderItem, OrderItemDocument } from '../order-item/schemas/order-item.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { NotificationService } from '../notification/notification.service';
import { OrderStatus, PaymentStatus } from '../../constants/enums';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private mpClient: MercadoPagoConfig;
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
    // Stripe Config
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2025-01-27.acacia' as any,
      });
    }

    // Mercado Pago Config
    const mpAccessToken = this.configService.get<string>('MP_ACCESS_TOKEN');
    if (mpAccessToken) {
      this.mpClient = new MercadoPagoConfig({
        accessToken: mpAccessToken,
      });
      this.logger.log('Mercado Pago configurado com sucesso');
    } else {
      this.logger.warn('MP_ACCESS_TOKEN não definido');
    }
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

    // Se for Mercado Pago (PIX ou Boleto ou até Card se preferir)
    if (paymentMethod === 'pix' || paymentMethod === 'boleto' || paymentMethod === 'mp-card') {
      return this.createMercadoPagoPreference(validatedItems, userId, paymentMethod);
    }

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
      if (!this.stripe) throw new Error('Stripe não configurado');
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        shipping_address_collection: {
          allowed_countries: ['BR'],
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
    }
    
    // Fallback para simulação se nada acima capturar
    return this.createSimulatedOrder(validatedItems, userId, paymentMethod);
  }

  private async createMercadoPagoPreference(validatedItems: any[], userId: string, method: string) {
    const preference = new Preference(this.mpClient);
    
    const items = validatedItems.map(item => ({
      id: item.id,
      title: item.name,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      currency_id: 'BRL',
      picture_url: item.image,
    }));

    try {
      const response = await preference.create({
        body: {
          items,
          payer: {
            email: 'cliente@exemplo.com', // Opcional: buscar email do user se disponível
          },
          back_urls: {
            success: `${process.env.FRONTEND_URL}/payment/success`,
            failure: `${process.env.FRONTEND_URL}/payment/failure`,
            pending: `${process.env.FRONTEND_URL}/payment/pending`,
          },
          auto_return: 'approved',
          notification_url: `${this.configService.get('BACKEND_URL')}/api/payment/mercadopago-webhook`,
          metadata: {
            userId,
            items: JSON.stringify(validatedItems.map(item => ({
              id: item.id,
              quantity: item.quantity,
              price: item.price,
              taxes: item.taxes,
            })))
          },
        }
      });

      return { sessionId: response.id, url: response.init_point };
    } catch (error) {
      this.logger.error('Erro ao criar preferência no Mercado Pago:', error);
      throw new Error('Erro ao processar pagamento com Mercado Pago');
    }
  }

  async processMercadoPagoPayment(paymentData: any, userId: string) {
    const payment = new Payment(this.mpClient);

    try {
      const response = await payment.create({
        body: {
          transaction_amount: paymentData.transaction_amount,
          token: paymentData.token,
          description: paymentData.description,
          installments: paymentData.installments,
          payment_method_id: paymentData.payment_method_id,
          issuer_id: paymentData.issuer_id,
          payer: {
            email: paymentData.payer.email,
            identification: {
              type: paymentData.payer.identification.type,
              number: paymentData.payer.identification.number,
            },
          },
          metadata: {
            user_id: userId,
            items: paymentData.metadata?.items,
          },
        },
      });

      // Se o pagamento for aprovado, podemos já adiantar a criação do pedido
      // Mas o ideal é que o webhook também processe para garantir consistência
      // Aqui apenas retornamos a resposta para o Checkout Bricks
      return response;
    } catch (error) {
      this.logger.error('Erro ao processar pagamento direto no Mercado Pago:', error);
      throw new Error('Erro ao processar pagamento: ' + (error.message || 'Erro desconhecido'));
    }
  }

  private async createSimulatedOrder(validatedItems: any[], userId: string, paymentMethod: string) {
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

  async handleMercadoPagoWebhook(payload: any) {
    this.logger.log('Mercado Pago Webhook recebido:', JSON.stringify(payload));
    
    const { type, data } = payload;

    if (type === 'payment') {
      const paymentId = data.id;
      // Buscar detalhes do pagamento no Mercado Pago
      try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${this.configService.get('MP_ACCESS_TOKEN')}`
          }
        });
        const paymentData = await response.json();

        if (paymentData.status === 'approved') {
          const { metadata } = paymentData;
          const userId = metadata.user_id;
          const items = JSON.parse(metadata.items);

          // Criar pedido similar ao Stripe
          const totalAmount = paymentData.transaction_amount;
          const totalTaxAmount = items.reduce((acc: number, item: any) => acc + (item.taxes?.totalTaxAmount * item.quantity || 0), 0);

          const newOrder = new this.orderModel({
            userId,
            totalAmount,
            totalTaxAmount,
            status: OrderStatus.PROCESSING,
            paymentStatus: PaymentStatus.COMPLETED,
            paymentMethod: paymentData.payment_method_id.toUpperCase(),
            orderNumber: `ORD-MP-${Date.now()}`,
            paymentId: paymentId.toString(),
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

          // Atualizar estoque
          for (const item of items) {
            await this.productModel.findByIdAndUpdate(item.id, {
              $inc: { stock: -item.quantity }
            });
          }

          await this.notificationService.create(
            userId,
            'Pagamento Aprovado!',
            `Seu pagamento via Mercado Pago foi confirmado. Pedido #${savedOrder.orderNumber}.`,
            'SUCCESS'
          );
        }
      } catch (error) {
        this.logger.error('Erro ao processar webhook do Mercado Pago:', error);
      }
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
