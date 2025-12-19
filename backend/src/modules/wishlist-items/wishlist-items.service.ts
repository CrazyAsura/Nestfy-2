import { Injectable } from '@nestjs/common';
import { CreateWishlistItemInput } from './dto/create-wishlist-item.input';
import { UpdateWishlistItemInput } from './dto/update-wishlist-item.input';

@Injectable()
export class WishlistItemsService {
  create(createWishlistItemInput: CreateWishlistItemInput) {
    return 'This action adds a new wishlistItem';
  }

  findAll() {
    return `This action returns all wishlistItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlistItem`;
  }

  update(id: number, updateWishlistItemInput: UpdateWishlistItemInput) {
    return `This action updates a #${id} wishlistItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlistItem`;
  }
}
