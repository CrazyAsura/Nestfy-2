import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotResolver } from './chatbot.resolver';

@Module({
  providers: [ChatbotResolver, ChatbotService],
})
export class ChatbotModule {}
