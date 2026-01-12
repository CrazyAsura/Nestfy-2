import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RiskDocument = Risk & Document;

@Schema({ timestamps: true, collection: 'risks' })
export class Risk {
  id: string; // Virtual property

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false, default: null })
  description: string | null;

  @Prop({ type: String, required: false, default: null })
  riskForPeople: string | null;

  @Prop({ type: String, required: false, default: null })
  riskForProduct: string | null;
}

export const RiskSchema = SchemaFactory.createForClass(Risk);

RiskSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

RiskSchema.set('toJSON', {
  virtuals: true,
});

RiskSchema.set('toObject', {
  virtuals: true,
});
