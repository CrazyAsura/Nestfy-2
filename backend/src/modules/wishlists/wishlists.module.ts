import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsResolver } from './wishlists.resolver';

@Module({
  providers: [WishlistsResolver, WishlistsService],
})
export class WishlistsModule {}
