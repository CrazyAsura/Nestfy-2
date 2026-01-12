import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart, CartDocument } from './schemas/cart.schema';
import { CartItem, CartItemDocument } from '../cart-item/schemas/cart-item.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItemDocument>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const cart = new this.cartModel(createCartDto);
    return await cart.save();
  }

  async findAll() {
    const carts = await this.cartModel.find().exec();
    return Promise.all(
      carts.map(async (cart) => {
        const items = await this.cartItemModel.find({ cartId: cart.id }).exec();
        return { ...cart.toObject(), items };
      }),
    );
  }

  async findOne(id: string) {
    const cart = await this.cartModel.findById(id).exec();
    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${id} não encontrado`);
    }
    const items = await this.cartItemModel.find({ cartId: cart.id }).exec();
    return { ...cart.toObject(), items };
  }

  async findByUserId(userId: string) {
    let cart = await this.cartModel.findOne({ userId }).exec();
    if (!cart) {
      cart = new this.cartModel({ userId });
      await cart.save();
    }
    const items = await this.cartItemModel.find({ cartId: cart.id }).exec();
    return { ...cart.toObject(), items };
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.cartModel
      .findByIdAndUpdate(id, updateCartDto, { new: true })
      .exec();
    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${id} não encontrado`);
    }
    return this.findOne(cart.id);
  }

  async remove(id: string) {
    const cart = await this.cartModel.findByIdAndDelete(id).exec();
    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${id} não encontrado`);
    }
    await this.cartItemModel.deleteMany({ cartId: id }).exec();
    return cart;
  }
}
