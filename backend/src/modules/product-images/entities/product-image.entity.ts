import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class ProductImage {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  @Field()
  isMain: boolean;

  @Field()
  productId: string;

  @Field(() => Product)
  product: Product;
}
