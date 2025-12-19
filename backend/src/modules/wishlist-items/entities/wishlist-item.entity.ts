import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class WishlistItem {
  @Field(() => ID)
  id: string;

  @Field()
  wishlistId: string;

  @Field(() => Wishlist)
  wishlist: Wishlist;

  @Field()
  productId: string;

  @Field(() => Product)
  product: Product;
}
