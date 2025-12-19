import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { OrderStatus, PaymentStatus } from './order-enums';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  orderNumber: string;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field({ nullable: true })
  paymentMethod?: string;

  @Field()
  shippingAddress: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => [OrderItem], { nullable: 'items' })
  items?: OrderItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
