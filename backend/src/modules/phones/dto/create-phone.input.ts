import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePhoneInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
