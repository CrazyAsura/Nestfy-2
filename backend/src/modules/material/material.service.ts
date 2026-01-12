import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material, MaterialDocument } from './schemas/material.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name)
    private readonly materialModel: Model<MaterialDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto) {
    const material = new this.materialModel(createMaterialDto);
    return await material.save();
  }

  async findAll() {
    const materials = await this.materialModel.find().exec();
    return Promise.all(
      materials.map(async (material) => {
        const products = await this.productModel.find({ materialId: material.id }).exec();
        return { ...material.toObject(), products };
      }),
    );
  }

  async findOne(id: string) {
    const material = await this.materialModel.findById(id).exec();
    if (!material) {
      throw new NotFoundException(`Material com ID ${id} não encontrado`);
    }
    const products = await this.productModel.find({ materialId: material.id }).exec();
    return { ...material.toObject(), products };
  }

  async update(id: string, updateMaterialDto: UpdateMaterialDto) {
    const material = await this.materialModel
      .findByIdAndUpdate(id, updateMaterialDto, { new: true })
      .exec();
    if (!material) {
      throw new NotFoundException(`Material com ID ${id} não encontrado`);
    }
    return material;
  }

  async remove(id: string) {
    const result = await this.materialModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Material com ID ${id} não encontrado`);
    }
    return result;
  }
}
