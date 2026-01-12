import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  id: string; // Virtual property

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, unique: true, required: true, index: true })
  slug: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, default: null })
  discountPrice: number | null;

  @Prop({ type: Number, default: 0 })
  stock: number;

  @Prop({ type: String, unique: true, required: true, index: true })
  sku: string;

  @Prop({ type: Number, default: null })
  weight: number | null;

  @Prop({ type: Number, default: null })
  height: number | null;

  @Prop({ type: Number, default: null })
  width: number | null;

  @Prop({ type: Number, default: null })
  length: number | null;

  @Prop({ type: String, default: null })
  color: string | null;

  @Prop({ type: String, required: true })
  categoryId: string;

  @Prop({ type: String, default: null })
  brandId: string | null;

  @Prop({ type: String, default: null })
  materialId: string | null;

  @Prop({ type: String, default: null })
  riskId: string | null;

  @Prop({ type: String, default: null })
  imageUrl: string | null;

  @Prop({ type: [Object], default: [] })
  images: { url: string; isMain: boolean }[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ProductSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

ProductSchema.set('toJSON', {
  virtuals: true,
});

ProductSchema.set('toObject', {
  virtuals: true,
});
