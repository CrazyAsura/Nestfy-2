import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true, collection: 'wishlists' })
export class Wishlist {
  id: string; // Virtual property

  @Prop({ type: String, unique: true, required: true, index: true })
  userId: string;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

WishlistSchema.set('toJSON', {
  virtuals: true,
});

WishlistSchema.set('toObject', {
  virtuals: true,
});
