import { Injectable } from '@nestjs/common';
import { CreateRiskInput } from './dto/create-risk.input';
import { UpdateRiskInput } from './dto/update-risk.input';

@Injectable()
export class RisksService {
  create(createRiskInput: CreateRiskInput) {
    return 'This action adds a new risk';
  }

  findAll() {
    return `This action returns all risks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} risk`;
  }

  update(id: number, updateRiskInput: UpdateRiskInput) {
    return `This action updates a #${id} risk`;
  }

  remove(id: number) {
    return `This action removes a #${id} risk`;
  }
}
