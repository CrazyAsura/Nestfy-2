import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatbotDocument = Chatbot & Document;

@Schema({ timestamps: true, collection: 'chatbot_logs' })
export class Chatbot {
  @Prop({ required: true })
  query: string;

  @Prop({ required: true })
  response: string;

  @Prop()
  userId: string;

  @Prop()
  sessionId: string;
}

export const ChatbotSchema = SchemaFactory.createForClass(Chatbot);
