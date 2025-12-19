import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatbotService } from './chatbot.service';
import { Chatbot } from './entities/chatbot.entity';
import { CreateChatbotInput } from './dto/create-chatbot.input';
import { UpdateChatbotInput } from './dto/update-chatbot.input';

@Resolver(() => Chatbot)
export class ChatbotResolver {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Mutation(() => Chatbot)
  createChatbot(@Args('createChatbotInput') createChatbotInput: CreateChatbotInput) {
    return this.chatbotService.create(createChatbotInput);
  }

  @Query(() => [Chatbot], { name: 'chatbot' })
  findAll() {
    return this.chatbotService.findAll();
  }

  @Query(() => Chatbot, { name: 'chatbot' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.chatbotService.findOne(id);
  }

  @Mutation(() => Chatbot)
  updateChatbot(@Args('updateChatbotInput') updateChatbotInput: UpdateChatbotInput) {
    return this.chatbotService.update(updateChatbotInput.id, updateChatbotInput);
  }

  @Mutation(() => Chatbot)
  removeChatbot(@Args('id', { type: () => Int }) id: number) {
    return this.chatbotService.remove(id);
  }
}
