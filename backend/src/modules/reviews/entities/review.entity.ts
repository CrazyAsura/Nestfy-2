import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  productId: string;

  @Field(() => Product)
  product: Product;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
