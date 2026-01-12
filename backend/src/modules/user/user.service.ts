import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('As senhas não coincidem');
    }

    const hashedPassword = await argon.hash(createUserDto.password);
    const { confirmPassword, ...userData } = createUserDto;

    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
      email: userData.email.trim().toLowerCase(),
    });

    return user.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.trim().toLowerCase(), deletedAt: null }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user || user.deletedAt) throw new BadRequestException('Usuário não encontrado');

    const dataToUpdate: any = { ...updateUserDto };
    
    if (updateUserDto.password) {
      if (updateUserDto.password !== updateUserDto.confirmPassword) {
        throw new BadRequestException('As senhas não coincidem');
      }
      dataToUpdate.password = await argon.hash(updateUserDto.password);
    }
    
    delete dataToUpdate.confirmPassword;
    
    if (dataToUpdate.email) {
      dataToUpdate.email = dataToUpdate.email.trim().toLowerCase();
    }

    return this.userModel.findByIdAndUpdate(id, dataToUpdate, { new: true }).exec();
  }

  async ban(id: string) {
    return this.userModel.findByIdAndUpdate(id, { isBanned: true }, { new: true }).exec();
  }

  async unban(id: string) {
    return this.userModel.findByIdAndUpdate(id, { isBanned: false }, { new: true }).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndUpdate(id, { deletedAt: new Date(), isActive: false }, { new: true }).exec();
  }
}
