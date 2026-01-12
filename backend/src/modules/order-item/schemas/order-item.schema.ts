import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema({ collection: 'order_items' })
export class OrderItem {
  id: string; // Virtual property

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true, index: true })
  orderId: string;

  @Prop({ type: String, required: true, index: true })
  productId: string;

  // Valores de Impostos Calculados
  @Prop({ type: Number, default: 0 })
  icmsAmount: number;

  @Prop({ type: Number, default: 0 })
  ipiAmount: number;

  @Prop({ type: Number, default: 0 })
  pisAmount: number;

  @Prop({ type: Number, default: 0 })
  cofinsAmount: number;

  @Prop({ type: Number, default: 0 })
  totalTaxAmount: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

OrderItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

OrderItemSchema.virtual('product', {
  ref: 'Product',
  localField: 'productId',
  foreignField: '_id',
  justOne: true,
});

OrderItemSchema.set('toJSON', {
  virtuals: true,
});

OrderItemSchema.set('toObject', {
  virtuals: true,
});
