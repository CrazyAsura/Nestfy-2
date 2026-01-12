import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true, collection: 'reviews' })
export class Review {
  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, required: false, default: null })
  comment: string | null;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, required: true, index: true })
  productId: string;

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({
    type: [{
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    default: []
  })
  replies: {
    userId: string;
    userName: string;
    comment: string;
    createdAt: Date;
  }[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

ReviewSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ReviewSchema.set('toJSON', {
  virtuals: true,
});

ReviewSchema.set('toObject', {
  virtuals: true,
});
