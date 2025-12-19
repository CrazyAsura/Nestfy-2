import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field()
  orderId: string;

  @Field(() => Order)
  order: Order;

  @Field()
  productId: string;

  @Field(() => Product)
  product: Product;
}
