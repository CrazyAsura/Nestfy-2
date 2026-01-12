import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { OrderItem, OrderItemDocument } from '../order-item/schemas/order-item.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItemDocument>,
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
    
    // Calcular total se não for fornecido
    let totalAmount = data.totalAmount;
    if (!totalAmount && data.items) {
      totalAmount = data.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
    }

    const order = new this.orderModel({
      ...data,
      orderNumber,
      totalAmount,
    });
    
    const savedOrder = await order.save();

    if (data.items && data.items.length > 0) {
      const items = data.items.map((item: any) => ({
        ...item,
        orderId: savedOrder.id,
      }));
      await this.orderItemModel.insertMany(items);
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
