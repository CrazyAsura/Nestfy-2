import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('wishlist_items')
@Unique(['wishlistId', 'productId'])
export class WishlistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  wishlistId: string;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wishlistId' })
  wishlist: Wishlist;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.wishlistItems)
  @JoinColumn({ name: 'productId' })
  product: Product;
}

