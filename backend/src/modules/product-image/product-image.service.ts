import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImage, ProductImageDocument } from './schemas/product-image.schema';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectModel(ProductImage.name)
    private readonly productImageModel: Model<ProductImageDocument>,
  ) {}

  async create(createProductImageDto: CreateProductImageDto) {
    const productImage = new this.productImageModel(createProductImageDto);
    return await productImage.save();
  }

  async findAll() {
    return await this.productImageModel.find().exec();
  }

  async findOne(id: string) {
    const productImage = await this.productImageModel.findById(id).exec();
    if (!productImage) {
      throw new NotFoundException(`Imagem do produto com ID ${id} não encontrada`);
    }
    return productImage;
  }

  async update(id: string, updateProductImageDto: UpdateProductImageDto) {
    const productImage = await this.productImageModel
      .findByIdAndUpdate(id, updateProductImageDto, { new: true })
      .exec();
    if (!productImage) {
      throw new NotFoundException(`Imagem do produto com ID ${id} não encontrada`);
    }
    return productImage;
  }

  async remove(id: string) {
    const result = await this.productImageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Imagem do produto com ID ${id} não encontrada`);
    }
    return result;
  }
}
