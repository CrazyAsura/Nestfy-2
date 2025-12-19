import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Chatbot {
  @Field(() => ID)
  id: string;

  @Field()
  query: string;

  @Field()
  response: string;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  createdAt: Date;
}
