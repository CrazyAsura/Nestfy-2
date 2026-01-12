import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  id: string; // Virtual property

  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String, unique: true, required: true })
  slug: string;

  @Prop({ type: String, required: false, default: null })
  imageUrl: string;

  @Prop({ type: String, default: null })
  parentId: string | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

CategorySchema.set('toJSON', {
  virtuals: true,
});

CategorySchema.set('toObject', {
  virtuals: true,
});
