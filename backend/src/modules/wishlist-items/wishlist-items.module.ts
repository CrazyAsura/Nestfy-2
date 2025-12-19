import { Module } from '@nestjs/common';
import { WishlistItemsService } from './wishlist-items.service';
import { WishlistItemsResolver } from './wishlist-items.resolver';

@Module({
  providers: [WishlistItemsResolver, WishlistItemsService],
})
export class WishlistItemsModule {}
