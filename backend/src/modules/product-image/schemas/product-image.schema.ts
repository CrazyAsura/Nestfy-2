import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductImageDocument = ProductImage & Document;

@Schema({ collection: 'product_images' })
export class ProductImage {
  @Prop({ required: true })
  url: string;

  @Prop({ default: false })
  isMain: boolean;

  @Prop({ type: String, required: true })
  productId: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

ProductImageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ProductImageSchema.set('toJSON', {
  virtuals: true,
});
