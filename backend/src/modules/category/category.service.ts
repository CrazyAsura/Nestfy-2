import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryModel.findOne({ name: createCategoryDto.name }).exec();
    if (existingCategory) {
      throw new ConflictException(`Categoria com o nome "${createCategoryDto.name}" já existe`);
    }

    const slug = createCategoryDto.name.toLowerCase().replace(/\s+/g, '-');
    const category = new this.categoryModel({
      ...createCategoryDto,
      slug,
    });
    return category.save();
  }

  async findAll(page = 1, limit = 10) {
    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (currentPage - 1) * perPage;

    const [categories, total] = await Promise.all([
      this.categoryModel.find()
        .skip(skip)
        .limit(perPage)
        .sort({ name: 1 })
        .exec(),
      this.categoryModel.countDocuments()
    ]);

    return {
      data: categories,
      meta: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: string) {
    const cacheKey = `category:${id}`;
    const cachedCategory = await this.cacheManager.get(cacheKey);

    if (cachedCategory) {
      return cachedCategory;
    }

    const category = await this.categoryModel.findById(id).exec();

    if (category) {
      await this.cacheManager.set(cacheKey, category, 3600);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryModel.findOne({ 
        name: updateCategoryDto.name,
        _id: { $ne: id }
      }).exec();
      
      if (existingCategory) {
        throw new ConflictException(`Categoria com o nome "${updateCategoryDto.name}" já existe`);
      }
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    await this.cacheManager.del(`category:${id}`);
    return updatedCategory;
  }

  async remove(id: string) {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }
    await this.cacheManager.del(`category:${id}`);
    return { message: 'Categoria removida com sucesso' };
  }
}
