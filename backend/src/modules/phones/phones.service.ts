import { Injectable } from '@nestjs/common';
import { CreatePhoneInput } from './dto/create-phone.input';
import { UpdatePhoneInput } from './dto/update-phone.input';

@Injectable()
export class PhonesService {
  create(createPhoneInput: CreatePhoneInput) {
    return 'This action adds a new phone';
  }

  findAll() {
    return `This action returns all phones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phone`;
  }

  update(id: number, updatePhoneInput: UpdatePhoneInput) {
    return `This action updates a #${id} phone`;
  }

  remove(id: number) {
    return `This action removes a #${id} phone`;
  }
}
