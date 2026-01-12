import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem, OrderItemDocument } from './schemas/order-item.schema';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItemDocument>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const orderItem = new this.orderItemModel(createOrderItemDto);
    return await orderItem.save();
  }

  async findAll() {
    return await this.orderItemModel.find().exec();
  }

  async findOne(id: string) {
    const orderItem = await this.orderItemModel.findById(id).exec();
    if (!orderItem) {
      throw new NotFoundException(`Item do pedido com ID ${id} não encontrado`);
    }
    return orderItem;
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.orderItemModel
      .findByIdAndUpdate(id, updateOrderItemDto, { new: true })
      .exec();
    if (!orderItem) {
      throw new NotFoundException(`Item do pedido com ID ${id} não encontrado`);
    }
    return orderItem;
  }

  async remove(id: string) {
    const result = await this.orderItemModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Item do pedido com ID ${id} não encontrado`);
    }
    return result;
  }
}
