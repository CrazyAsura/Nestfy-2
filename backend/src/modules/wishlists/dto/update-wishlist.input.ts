import { CreateWishlistInput } from './create-wishlist.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWishlistInput extends PartialType(CreateWishlistInput) {
  @Field(() => Int)
  id: number;
}
