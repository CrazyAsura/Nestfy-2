import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { WishlistItem } from '../../wishlist-items/entities/wishlist-item.entity';

@ObjectType()
export class Wishlist {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => [WishlistItem], { nullable: 'items' })
  items?: WishlistItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
