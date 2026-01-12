import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Brand } from '../../brand/entities/brand.entity';
import { ProductImage } from '../../product-image/entities/product-image.entity';
import { Review } from '../../review/entities/review.entity';
import { OrderItem } from '../../order-item/entities/order-item.entity';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
import { WishlistItem } from '../../wishlist-item/entities/wishlist-item.entity';
import { Material } from '../../material/entities/material.entity';
import { Risk } from '../../risk/entities/risk.entity';

@Entity('products')
@Index(['slug'])
@Index(['sku'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ unique: true })
  sku: string;

  @Column('float', { nullable: true })
  weight: number;

  @Column('float', { nullable: true })
  height: number;

  @Column('float', { nullable: true })
  width: number;

  @Column('float', { nullable: true })
  length: number;

  @Column({ nullable: true })
  color: string;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  brandId: string;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.product)
  wishlistItems: WishlistItem[];

  @Column({ nullable: true })
  materialId: string;

  @ManyToOne(() => Material, (material) => material.products, { nullable: true })
  @JoinColumn({ name: 'materialId' })
  material: Material;

  @Column({ nullable: true })
  riskId: string;

  @ManyToOne(() => Risk, (risk) => risk.products, { nullable: true })
  @JoinColumn({ name: 'riskId' })
  risk: Risk;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}

