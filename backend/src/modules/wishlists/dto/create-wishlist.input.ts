import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateWishlistInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
