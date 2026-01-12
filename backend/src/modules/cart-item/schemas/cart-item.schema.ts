import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartItemDocument = CartItem & Document;

@Schema({ collection: 'cart_items' })
export class CartItem {
  id: string; // Virtual property

  @Prop({ type: Number, default: 1 })
  quantity: number;

  @Prop({ type: String, required: true, index: true })
  cartId: string;

  @Prop({ type: String, required: true, index: true })
  productId: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

CartItemSchema.index({ cartId: 1, productId: 1 }, { unique: true });

CartItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

CartItemSchema.set('toJSON', {
  virtuals: true,
});

CartItemSchema.set('toObject', {
  virtuals: true,
});
