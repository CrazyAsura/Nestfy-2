import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class Brand {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  logoUrl?: string;

  @Field(() => [Product], { nullable: 'items' })
  products?: Product[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
