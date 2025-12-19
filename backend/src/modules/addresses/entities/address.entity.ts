import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Address {
  @Field(() => ID)
  id: string;

  @Field()
  street: string;

  @Field()
  number: string;

  @Field({ nullable: true })
  complement?: string;

  @Field()
  neighborhood: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  country: string;

  @Field()
  zipCode: string;

  @Field()
  isDefault: boolean;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
