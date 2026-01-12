import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({ timestamps: true, collection: 'brands' })
export class Brand {
  id: string; // Virtual property

  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String, required: false, default: null })
  logoUrl: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

BrandSchema.set('toJSON', {
  virtuals: true,
});

BrandSchema.set('toObject', {
  virtuals: true,
});
