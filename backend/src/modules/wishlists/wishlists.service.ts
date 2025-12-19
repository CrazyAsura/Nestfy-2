import { Injectable } from '@nestjs/common';
import { CreateWishlistInput } from './dto/create-wishlist.input';
import { UpdateWishlistInput } from './dto/update-wishlist.input';

@Injectable()
export class WishlistsService {
  create(createWishlistInput: CreateWishlistInput) {
    return 'This action adds a new wishlist';
  }

  findAll() {
    return `This action returns all wishlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistInput: UpdateWishlistInput) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
