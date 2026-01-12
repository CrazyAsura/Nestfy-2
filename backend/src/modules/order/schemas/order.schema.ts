import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus, PaymentStatus } from '../../../constants/enums';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  id: string; // Virtual property

  @Prop({ type: String, unique: true, required: true })
  orderNumber: string;

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Prop({ type: String, required: false, default: null })
  paymentMethod: string | null;

  @Prop({ type: String, required: true })
  shippingAddress: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, required: false })
  invoiceNumber: string;

  @Prop({ type: String, required: false })
  invoiceUrl: string;

  @Prop({ type: Date, required: false })
  invoiceDate: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

OrderSchema.set('toJSON', {
  virtuals: true,
});

OrderSchema.set('toObject', {
  virtuals: true,
});
