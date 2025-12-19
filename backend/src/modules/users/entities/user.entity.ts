import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from './role.enum';
import { Address } from '../../addresses/entities/address.entity';
import { Phone } from '../../phones/entities/phone.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Chatbot } from '../../chatbot/entities/chatbot.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Role)
  role: Role;

  @Field()
  isActive: boolean;

  @Field(() => [Address], { nullable: 'items' })
  addresses?: Address[];

  @Field(() => [Phone], { nullable: 'items' })
  phones?: Phone[];

  @Field(() => [Review], { nullable: 'items' })
  reviews?: Review[];

  @Field(() => [Order], { nullable: 'items' })
  orders?: Order[];

  @Field(() => Cart, { nullable: true })
  cart?: Cart;

  @Field(() => Wishlist, { nullable: true })
  wishlist?: Wishlist;

  @Field(() => [Chatbot], { nullable: 'items' })
  chatbotLogs?: Chatbot[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
