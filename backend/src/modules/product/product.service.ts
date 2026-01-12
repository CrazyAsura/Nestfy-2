import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { ProductImage, ProductImageDocument } from '../product-image/schemas/product-image.schema';
import { Category, CategoryDocument } from '../category/schemas/category.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductImage.name)
    private readonly productImageModel: Model<ProductImageDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  async create(createProductDto: CreateProductDto) {
    const slug = this.generateSlug(createProductDto.name);
    const sku = createProductDto.sku || `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const product = new this.productModel({
      ...createProductDto,
      slug,
      sku,
    });

    const savedProduct = await product.save();

    if (createProductDto.images && createProductDto.images.length > 0) {
      const images = createProductDto.images.map(img => ({
        url: img.url,
        isMain: img.isMain || false,
        productId: savedProduct.id,
      }));
      await this.productImageModel.insertMany(images);
    }

    return this.findOne(savedProduct.id);
  }

  async findAll(
    page = 1, 
    limit = 10, 
    search?: string, 
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: string,
    order: 'asc' | 'desc' = 'desc'
  ) { 
    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.min(Math.max(Number(limit), 1), 100);

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = order === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const skip = (currentPage - 1) * perPage;

    const [products, total] = await Promise.all([
      this.productModel.find(query)
        .populate('category')
        .skip(skip)
        .limit(perPage)
        .sort(sort)
        .exec(),
      this.productModel.countDocuments(query)
    ]);
    
    return {
      data: products,
      meta: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const cacheKey = `product:${id}`;
    const cachedProduct = await this.cacheManager.get<Product>(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.productModel.findById(id)
      .populate('category')
      .exec();

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    await this.cacheManager.set(cacheKey, product, 3600); // 1 hora
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    
    if (updateProductDto.name) {
      product.slug = this.generateSlug(updateProductDto.name);
    }

    Object.assign(product, updateProductDto);
    
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    await this.cacheManager.del(`product:${id}`);
    
    return updatedProduct;
  }

  async remove(id: string) {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    await this.cacheManager.del(`product:${id}`);
    return { message: 'Produto removido com sucesso' };
  }
}
