import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Phone {
  @Field(() => ID)
  id: string;

  @Field()
  ddi: string;

  @Field()
  ddd: string;

  @Field()
  number: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
