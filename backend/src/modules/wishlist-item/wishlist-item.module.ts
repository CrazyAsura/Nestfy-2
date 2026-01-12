import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistItemService } from './wishlist-item.service';
import { WishlistItemController } from './wishlist-item.controller';
import { WishlistItem, WishlistItemSchema } from './schemas/wishlist-item.schema';
import { WishlistModule } from '../wishlist/wishlist.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WishlistItem.name, schema: WishlistItemSchema },
    ]),
    WishlistModule,
  ],
  controllers: [WishlistItemController],
  providers: [WishlistItemService],
  exports: [WishlistItemService],
})
export class WishlistItemModule {}
