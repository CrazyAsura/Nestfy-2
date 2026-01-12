import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true, collection: 'refresh_tokens' })
export class RefreshToken {
  @Prop({ type: String, unique: true, required: true, index: true })
  token: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

RefreshTokenSchema.set('toJSON', {
  virtuals: true,
});
