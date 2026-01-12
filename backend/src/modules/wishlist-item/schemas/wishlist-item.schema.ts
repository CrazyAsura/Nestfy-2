import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WishlistItemDocument = WishlistItem & Document;

@Schema({ collection: 'wishlist_items' })
export class WishlistItem {
  id: string; // Virtual property

  @Prop({ type: String, required: true, index: true })
  wishlistId: string;

  @Prop({ type: String, required: true, index: true })
  productId: string;
}

export const WishlistItemSchema = SchemaFactory.createForClass(WishlistItem);

WishlistItemSchema.index({ wishlistId: 1, productId: 1 }, { unique: true });

WishlistItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

WishlistItemSchema.set('toJSON', {
  virtuals: true,
});

WishlistItemSchema.set('toObject', {
  virtuals: true,
});
