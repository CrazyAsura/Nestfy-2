import { Module } from '@nestjs/common';
import { WishlistItemService } from './wishlist-item.service';
import { WishlistItemController } from './wishlist-item.controller';

@Module({
  controllers: [WishlistItemController],
  providers: [WishlistItemService],
})
export class WishlistItemModule {}
