import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { ProductImage } from '../../product-images/entities/product-image.entity';
import { Review } from '../../reviews/entities/review.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { CartItem } from '../../cart-items/entities/cart-item.entity';
import { WishlistItem } from '../../wishlist-items/entities/wishlist-item.entity';
import { Material } from '../../materials/entities/material.entity';
import { Risk } from '../../risks/entities/risk.entity';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  discountPrice?: number;

  @Field(() => Int)
  stock: number;

  @Field()
  sku: string;

  @Field(() => Float, { nullable: true })
  weight?: number;

  @Field(() => Float, { nullable: true })
  height?: number;

  @Field(() => Float, { nullable: true })
  width?: number;

  @Field(() => Float, { nullable: true })
  length?: number;

  @Field({ nullable: true })
  color?: string;

  @Field()
  categoryId: string;

  @Field(() => Category)
  category: Category;

  @Field({ nullable: true })
  brandId?: string;

  @Field(() => Brand, { nullable: true })
  brand?: Brand;

  @Field(() => [ProductImage], { nullable: 'items' })
  images?: ProductImage[];

  @Field(() => [Review], { nullable: 'items' })
  reviews?: Review[];

  @Field(() => [OrderItem], { nullable: 'items' })
  orderItems?: OrderItem[];

  @Field(() => [CartItem], { nullable: 'items' })
  cartItems?: CartItem[];

  @Field(() => [WishlistItem], { nullable: 'items' })
  wishlistItems?: WishlistItem[];

  @Field({ nullable: true })
  materialId?: string;

  @Field(() => Material, { nullable: true })
  material?: Material;

  @Field({ nullable: true })
  riskId?: string;

  @Field(() => Risk, { nullable: true })
  risk?: Risk;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
