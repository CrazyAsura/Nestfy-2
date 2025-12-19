import { CreateWishlistItemInput } from './create-wishlist-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWishlistItemInput extends PartialType(CreateWishlistItemInput) {
  @Field(() => Int)
  id: number;
}
