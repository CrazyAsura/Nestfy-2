import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Address, AddressDocument } from '../address/schemas/address.schema';
import { Phone, PhoneDocument } from '../phone/schemas/phone.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { RefreshToken, RefreshTokenDocument } from '../refresh-token/schemas/refresh-token.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
    @InjectModel(Phone.name)
    private readonly phoneModel: Model<PhoneDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
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
    return this.userModel.findOne({ email: email.trim().toLowerCase() }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new BadRequestException('Usuário não encontrado');

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
    this.logger.log(`Iniciando exclusão permanente do usuário: ${id}`);
    
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Deletar dados relacionados
    await Promise.all([
      this.addressModel.deleteMany({ userId: id }).exec(),
      this.phoneModel.deleteMany({ userId: id }).exec(),
      this.cartModel.deleteMany({ userId: id }).exec(),
      this.refreshTokenModel.deleteMany({ userId: id }).exec(),
    ]);

    this.logger.log(`Dados relacionados (endereços, telefones, carrinho, tokens) removidos para o usuário: ${id}`);

    // Deletar o usuário permanentemente
    const result = await this.userModel.findByIdAndDelete(id).exec();
    
    this.logger.log(`Usuário ${id} removido permanentemente do banco de dados`);
    
    return result;
  }
}
