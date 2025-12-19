import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => Category, { nullable: true })
  parent?: Category;

  @Field(() => [Category], { nullable: 'items' })
  children?: Category[];

  @Field(() => [Product], { nullable: 'items' })
  products?: Product[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
