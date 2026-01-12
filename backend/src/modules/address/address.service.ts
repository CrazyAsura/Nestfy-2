import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address, AddressDocument } from './schemas/address.schema';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) {}

  async create(createAddressDto: CreateAddressDto, userId: string) {
    const address = new this.addressModel({
      ...createAddressDto,
      userId,
    });
    return await address.save();
  }

  async findAll() {
    return await this.addressModel.find().exec();
  }

  async findOne(id: string) {
    const address = await this.addressModel.findById(id).exec();
    if (!address) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressModel
      .findByIdAndUpdate(id, updateAddressDto, { new: true })
      .exec();
    if (!address) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return address;
  }

  async remove(id: string) {
    const result = await this.addressModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Endereço com ID ${id} não encontrado`);
    }
    return result;
  }
}
