import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true, collection: 'addresses' })
export class Address {
  id: string; // Virtual property

  @Prop({ type: String, required: true })
  street: string;

  @Prop({ type: String, required: true })
  number: string;

  @Prop({ type: String, required: false, default: null })
  complement: string;

  @Prop({ type: String, required: true })
  neighborhood: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, default: 'Brasil' })
  country: string;

  @Prop({ type: String, required: true })
  zipCode: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

AddressSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

AddressSchema.set('toJSON', {
  virtuals: true,
});

AddressSchema.set('toObject', {
  virtuals: true,
});
