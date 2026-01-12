import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem, CartItemDocument } from './schemas/cart-item.schema';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItemDocument>,
    private readonly cartService: CartService,
  ) {}

  async create(createCartItemDto: CreateCartItemDto, userId: string) {
    const cart = await this.cartService.findByUserId(userId);
    
    // Check if item already exists in cart
    const existingItem = await this.cartItemModel.findOne({
      cartId: (cart as any)._id,
      productId: createCartItemDto.productId,
    }).exec();

    if (existingItem) {
      existingItem.quantity += createCartItemDto.quantity;
      return await existingItem.save();
    }

    const cartItem = new this.cartItemModel({
      ...createCartItemDto,
      cartId: (cart as any)._id,
    });
    return await cartItem.save();
  }

  async findAll() {
    return await this.cartItemModel.find().exec();
  }

  async findOne(id: string) {
    const cartItem = await this.cartItemModel.findById(id).exec();
    if (!cartItem) {
      throw new NotFoundException(`Item do carrinho com ID ${id} não encontrado`);
    }
    return cartItem;
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto) {
    const cartItem = await this.cartItemModel
      .findByIdAndUpdate(id, updateCartItemDto, { new: true })
      .exec();
    if (!cartItem) {
      throw new NotFoundException(`Item do carrinho com ID ${id} não encontrado`);
    }
    return cartItem;
  }

  async remove(id: string) {
    const result = await this.cartItemModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Item do carrinho com ID ${id} não encontrado`);
    }
    return result;
  }
}
