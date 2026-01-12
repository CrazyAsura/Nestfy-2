import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { Phone, PhoneDocument } from './schemas/phone.schema';

@Injectable()
export class PhoneService {
  constructor(
    @InjectModel(Phone.name)
    private readonly phoneModel: Model<PhoneDocument>,
  ) {}

  async create(createPhoneDto: CreatePhoneDto) {
    const phone = new this.phoneModel(createPhoneDto);
    return await phone.save();
  }

  async findAll() {
    return await this.phoneModel.find().exec();
  }

  async findOne(id: string) {
    const phone = await this.phoneModel.findById(id).exec();
    if (!phone) {
      throw new NotFoundException(`Telefone com ID ${id} não encontrado`);
    }
    return phone;
  }

  async update(id: string, updatePhoneDto: UpdatePhoneDto) {
    const phone = await this.phoneModel
      .findByIdAndUpdate(id, updatePhoneDto, { new: true })
      .exec();
    if (!phone) {
      throw new NotFoundException(`Telefone com ID ${id} não encontrado`);
    }
    return phone;
  }

  async remove(id: string) {
    const result = await this.phoneModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Telefone com ID ${id} não encontrado`);
    }
    return result;
  }
}
