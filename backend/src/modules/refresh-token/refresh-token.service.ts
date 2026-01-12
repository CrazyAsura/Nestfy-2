import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-token.dto';
import { RefreshToken, RefreshTokenDocument } from './schemas/refresh-token.schema';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async create(createRefreshTokenDto: CreateRefreshTokenDto) {
    const refreshToken = new this.refreshTokenModel(createRefreshTokenDto);
    return await refreshToken.save();
  }

  async findAll() {
    return await this.refreshTokenModel.find().exec();
  }

  async findOne(id: string) {
    const refreshToken = await this.refreshTokenModel.findById(id).exec();
    if (!refreshToken) {
      throw new NotFoundException(`Refresh token com ID ${id} não encontrado`);
    }
    return refreshToken;
  }

  async findByToken(token: string) {
    return await this.refreshTokenModel.findOne({ token }).exec();
  }

  async update(id: string, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    const refreshToken = await this.refreshTokenModel
      .findByIdAndUpdate(id, updateRefreshTokenDto, { new: true })
      .exec();
    if (!refreshToken) {
      throw new NotFoundException(`Refresh token com ID ${id} não encontrado`);
    }
    return refreshToken;
  }

  async remove(id: string) {
    const result = await this.refreshTokenModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Refresh token com ID ${id} não encontrado`);
    }
    return result;
  }

  async removeByUserId(userId: string) {
    return await this.refreshTokenModel.deleteMany({ userId }).exec();
  }
}
