import { CreateChatbotInput } from './create-chatbot.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateChatbotInput extends PartialType(CreateChatbotInput) {
  @Field(() => Int)
  id: number;
}
