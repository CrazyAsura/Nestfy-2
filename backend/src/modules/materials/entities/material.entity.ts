import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class Material {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => [Product], { nullable: 'items' })
  products?: Product[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
