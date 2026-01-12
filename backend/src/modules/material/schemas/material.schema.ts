import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true, collection: 'materials' })
export class Material {
  id: string; // Virtual property

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false, default: null })
  type: string | null;

  @Prop({ type: String, required: false, default: null })
  imageUrl: string | null;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

MaterialSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

MaterialSchema.set('toJSON', {
  virtuals: true,
});

MaterialSchema.set('toObject', {
  virtuals: true,
});
