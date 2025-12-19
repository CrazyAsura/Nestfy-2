import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChatbotInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
