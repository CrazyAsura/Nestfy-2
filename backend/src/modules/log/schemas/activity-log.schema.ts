import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true, collection: 'activity_logs' })
export class ActivityLog {
  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  duration: number;

  @Prop()
  userAgent: string;

  @Prop({ type: Object })
  metadata: any;

  @Prop()
  userId: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
