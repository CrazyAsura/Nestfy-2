import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRiskInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
