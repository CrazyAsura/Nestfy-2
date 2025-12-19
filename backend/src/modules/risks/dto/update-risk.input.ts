import { CreateRiskInput } from './create-risk.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRiskInput extends PartialType(CreateRiskInput) {
  @Field(() => Int)
  id: number;
}
