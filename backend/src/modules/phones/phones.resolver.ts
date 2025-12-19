import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PhonesService } from './phones.service';
import { Phone } from './entities/phone.entity';
import { CreatePhoneInput } from './dto/create-phone.input';
import { UpdatePhoneInput } from './dto/update-phone.input';

@Resolver(() => Phone)
export class PhonesResolver {
  constructor(private readonly phonesService: PhonesService) {}

  @Mutation(() => Phone)
  createPhone(@Args('createPhoneInput') createPhoneInput: CreatePhoneInput) {
    return this.phonesService.create(createPhoneInput);
  }

  @Query(() => [Phone], { name: 'phones' })
  findAll() {
    return this.phonesService.findAll();
  }

  @Query(() => Phone, { name: 'phone' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.phonesService.findOne(id);
  }

  @Mutation(() => Phone)
  updatePhone(@Args('updatePhoneInput') updatePhoneInput: UpdatePhoneInput) {
    return this.phonesService.update(updatePhoneInput.id, updatePhoneInput);
  }

  @Mutation(() => Phone)
  removePhone(@Args('id', { type: () => Int }) id: number) {
    return this.phonesService.remove(id);
  }
}
