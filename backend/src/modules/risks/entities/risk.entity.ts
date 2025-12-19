import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class Risk {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  riskForPeople?: string;

  @Field({ nullable: true })
  riskForProduct?: string;

  @Field(() => [Product], { nullable: 'items' })
  products?: Product[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
