import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Cart } from '../../carts/entities/cart.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class CartItem {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  cartId: string;

  @Field(() => Cart)
  cart: Cart;

  @Field()
  productId: string;

  @Field(() => Product)
  product: Product;
}
