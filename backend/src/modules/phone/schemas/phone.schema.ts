import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DDI, DDD } from '../../../constants/enums';

export type PhoneDocument = Phone & Document;

@Schema({ timestamps: true, collection: 'phones' })
export class Phone {
  id: string; // Virtual property

  @Prop({
    type: String,
    enum: DDI,
    default: DDI.BRA_55,
  })
  ddi: DDI;

  @Prop({
    type: String,
    enum: DDD,
    required: true,
  })
  ddd: DDD;

  @Prop({ type: String, required: true })
  numberPhone: string;

  @Prop({ type: String, required: true })
  userId: string;
}

export const PhoneSchema = SchemaFactory.createForClass(Phone);

PhoneSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

PhoneSchema.set('toJSON', {
  virtuals: true,
});

PhoneSchema.set('toObject', {
  virtuals: true,
});
