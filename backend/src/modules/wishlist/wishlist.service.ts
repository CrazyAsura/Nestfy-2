import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { WishlistItem, WishlistItemDocument } from '../wishlist-item/schemas/wishlist-item.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name)
    private readonly wishlistModel: Model<WishlistDocument>,
    @InjectModel(WishlistItem.name)
    private readonly wishlistItemModel: Model<WishlistItemDocument>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    const wishlist = new this.wishlistModel(createWishlistDto);
    return await wishlist.save();
  }

  async findAll() {
    const wishlists = await this.wishlistModel.find().exec();
    return Promise.all(
      wishlists.map(async (wishlist) => {
        const items = await this.wishlistItemModel.find({ wishlistId: wishlist.id }).exec();
        return { ...wishlist.toObject(), items };
      }),
    );
  }

  async findOne(id: string) {
    const wishlist = await this.wishlistModel.findById(id).exec();
    if (!wishlist) {
      throw new NotFoundException(`Lista de desejos com ID ${id} não encontrada`);
    }
    const items = await this.wishlistItemModel.find({ wishlistId: wishlist.id }).exec();
    return { ...wishlist.toObject(), items };
  }

  async findByUserId(userId: string) {
    let wishlist = await this.wishlistModel.findOne({ userId }).exec();
    if (!wishlist) {
      wishlist = new this.wishlistModel({ userId });
      await wishlist.save();
    }
    const items = await this.wishlistItemModel.find({ wishlistId: wishlist.id }).exec();
    return { ...wishlist.toObject(), items };
  }

  async update(id: string, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.wishlistModel
      .findByIdAndUpdate(id, updateWishlistDto, { new: true })
      .exec();
    if (!wishlist) {
      throw new NotFoundException(`Lista de desejos com ID ${id} não encontrada`);
    }
    return this.findOne(wishlist.id);
  }

  async remove(id: string) {
    const wishlist = await this.wishlistModel.findByIdAndDelete(id).exec();
    if (!wishlist) {
      throw new NotFoundException(`Lista de desejos com ID ${id} não encontrada`);
    }
    await this.wishlistItemModel.deleteMany({ wishlistId: id }).exec();
    return wishlist;
  }
}
