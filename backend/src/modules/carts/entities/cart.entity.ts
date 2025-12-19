import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';

@ObjectType()
export class Cart {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => [CartItem], { nullable: 'items' })
  items?: CartItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
