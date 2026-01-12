import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true, collection: 'carts' })
export class Cart {
  id: string; // Virtual property

  @Prop({ type: String, unique: true, required: true, index: true })
  userId: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

CartSchema.set('toJSON', {
  virtuals: true,
});

CartSchema.set('toObject', {
  virtuals: true,
});
