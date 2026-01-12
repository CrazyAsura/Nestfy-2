import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRiskDto } from './dto/create-risk.dto';
import { UpdateRiskDto } from './dto/update-risk.dto';
import { Risk, RiskDocument } from './schemas/risk.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class RiskService {
  constructor(
    @InjectModel(Risk.name)
    private readonly riskModel: Model<RiskDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createRiskDto: CreateRiskDto) {
    const risk = new this.riskModel(createRiskDto);
    return await risk.save();
  }

  async findAll() {
    const risks = await this.riskModel.find().exec();
    return Promise.all(
      risks.map(async (risk) => {
        const products = await this.productModel.find({ riskId: risk.id }).exec();
        return { ...risk.toObject(), products };
      }),
    );
  }

  async findOne(id: string) {
    const risk = await this.riskModel.findById(id).exec();
    if (!risk) {
      throw new NotFoundException(`Risco com ID ${id} não encontrado`);
    }
    const products = await this.productModel.find({ riskId: risk.id }).exec();
    return { ...risk.toObject(), products };
  }

  async update(id: string, updateRiskDto: UpdateRiskDto) {
    const risk = await this.riskModel
      .findByIdAndUpdate(id, updateRiskDto, { new: true })
      .exec();
    if (!risk) {
      throw new NotFoundException(`Risco com ID ${id} não encontrado`);
    }
    return risk;
  }

  async remove(id: string) {
    const result = await this.riskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Risco com ID ${id} não encontrado`);
    }
    return result;
  }
}
