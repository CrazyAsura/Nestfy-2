import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { WishlistItemsService } from './wishlist-items.service';
import { WishlistItem } from './entities/wishlist-item.entity';
import { CreateWishlistItemInput } from './dto/create-wishlist-item.input';
import { UpdateWishlistItemInput } from './dto/update-wishlist-item.input';

@Resolver(() => WishlistItem)
export class WishlistItemsResolver {
  constructor(private readonly wishlistItemsService: WishlistItemsService) {}

  @Mutation(() => WishlistItem)
  createWishlistItem(@Args('createWishlistItemInput') createWishlistItemInput: CreateWishlistItemInput) {
    return this.wishlistItemsService.create(createWishlistItemInput);
  }

  @Query(() => [WishlistItem], { name: 'wishlistItems' })
  findAll() {
    return this.wishlistItemsService.findAll();
  }

  @Query(() => WishlistItem, { name: 'wishlistItem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.wishlistItemsService.findOne(id);
  }

  @Mutation(() => WishlistItem)
  updateWishlistItem(@Args('updateWishlistItemInput') updateWishlistItemInput: UpdateWishlistItemInput) {
    return this.wishlistItemsService.update(updateWishlistItemInput.id, updateWishlistItemInput);
  }

  @Mutation(() => WishlistItem)
  removeWishlistItem(@Args('id', { type: () => Int }) id: number) {
    return this.wishlistItemsService.remove(id);
  }
}
