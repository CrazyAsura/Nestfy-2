import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist-item.dto';
import { WishlistItem, WishlistItemDocument } from './schemas/wishlist-item.schema';
import { WishlistService } from '../wishlist/wishlist.service';

@Injectable()
export class WishlistItemService {
  constructor(
    @InjectModel(WishlistItem.name)
    private readonly wishlistItemModel: Model<WishlistItemDocument>,
    private readonly wishlistService: WishlistService,
  ) {}

  async create(createWishlistItemDto: CreateWishlistItemDto, userId: string) {
    const wishlist = await this.wishlistService.findByUserId(userId);
    
    // Check if item already exists in wishlist
    const wishlistId = (wishlist as any).id || (wishlist as any)._id?.toString();
    const existingItem = await this.wishlistItemModel.findOne({
      wishlistId,
      productId: createWishlistItemDto.productId,
    }).exec();

    if (existingItem) {
      return existingItem;
    }

    const wishlistItem = new this.wishlistItemModel({
      ...createWishlistItemDto,
      wishlistId,
    });
    return await wishlistItem.save();
  }

  async findAll() {
    return await this.wishlistItemModel.find().exec();
  }

  async findOne(id: string) {
    const wishlistItem = await this.wishlistItemModel.findById(id).exec();
    if (!wishlistItem) {
      throw new NotFoundException(`Item da lista de desejos com ID ${id} não encontrado`);
    }
    return wishlistItem;
  }

  async update(id: string, updateWishlistItemDto: UpdateWishlistItemDto) {
    const wishlistItem = await this.wishlistItemModel
      .findByIdAndUpdate(id, updateWishlistItemDto, { new: true })
      .exec();
    if (!wishlistItem) {
      throw new NotFoundException(`Item da lista de desejos com ID ${id} não encontrado`);
    }
    return wishlistItem;
  }

  async remove(id: string) {
    const result = await this.wishlistItemModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Item da lista de desejos com ID ${id} não encontrado`);
    }
    return result;
  }
}
