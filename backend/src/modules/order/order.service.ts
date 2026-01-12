import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderItem, OrderItemDocument } from '../order-item/schemas/order-item.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItemDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findAllByUser(userId: string) {
    const orders = await this.orderModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await this.orderItemModel
          .find({ orderId: order.id })
          .populate('product')
          .exec();
        return { ...order.toObject(), items };
      }),
    );

    return ordersWithItems;
  }

  async findOne(id: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: id, userId }).exec();

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const items = await this.orderItemModel
      .find({ orderId: order.id })
      .populate('product')
      .exec();

    return { ...order.toObject(), items };
  }

  async create(data: any) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Calcular total e impostos se houver itens
    let totalAmount = 0;
    let totalTaxAmount = 0;
    const itemsWithTaxes: any[] = [];

    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const product = await this.productModel.findById(item.productId);
        if (!product) continue;

        const price = item.price || product.discountPrice || product.price;
        const quantity = item.quantity;

        const icmsAmount = (price * (product.icms || 0)) / 100;
        const ipiAmount = (price * (product.ipi || 0)) / 100;
        const pisAmount = (price * (product.pis || 0)) / 100;
        const cofinsAmount = (price * (product.cofins || 0)) / 100;
        const itemTaxTotal = icmsAmount + ipiAmount + pisAmount + cofinsAmount;

        totalAmount += price * quantity;
        totalTaxAmount += itemTaxTotal * quantity;

        itemsWithTaxes.push({
          ...item,
          price,
          icmsAmount,
          ipiAmount,
          pisAmount,
          cofinsAmount,
          totalTaxAmount: itemTaxTotal
        });
      }
    }

    const order = new this.orderModel({
      ...data,
      orderNumber,
      totalAmount: data.totalAmount || totalAmount,
      totalTaxAmount: totalTaxAmount,
    });
    
    const savedOrder = await order.save();

    if (itemsWithTaxes.length > 0) {
      const itemsToSave = itemsWithTaxes.map((item: any) => ({
        ...item,
        orderId: savedOrder.id,
      }));
      await this.orderItemModel.insertMany(itemsToSave);
    }
    
    return this.findOne(savedOrder.id, data.userId);
  }

  async update(id: string, userId: string, data: any) {
    const order = await this.orderModel
      .findOneAndUpdate({ _id: id, userId }, data, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return this.findOne(order.id, userId);
  }

  async remove(id: string, userId: string) {
    const order = await this.orderModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }
    await this.orderItemModel.deleteMany({ orderId: id }).exec();
    return order;
  }
}
