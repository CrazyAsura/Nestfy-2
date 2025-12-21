import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  async create(createProductDto: CreateProductDto) {
    const slug = this.generateSlug(createProductDto.name);
    const sku = `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`;

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        slug,
        description: createProductDto.description,
        price: createProductDto.price,
        discountPrice: createProductDto.discountPrice,
        stock: createProductDto.stock,
        sku,
        category: {
          connect: {
            id: createProductDto.categoryId,
          },
        },
        images: {
          create: createProductDto.images ? createProductDto.images.map(img => ({
            url: img.url,
            isMain: img.isMain || false,
          })) : undefined,
        },
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async findAll(page = 1, limit = 10) { 

    const currentPage = Math.max(Number(page),1);
    const perPage = Math.min(Math.max(Number(limit), 1), 100)

    const skip = ( currentPage -1 ) * perPage;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: perPage,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          images: true,
          category: true,
        }
      }),
      this.prisma.product.count()
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

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const { categoryId, images, ...data } = updateProductDto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        category: categoryId ? {
          connect: { id: categoryId }
        } : undefined,
        images: images ? {
          create: images.map(img => ({
            url: img.url,
            isMain: img.isMain || false,
          }))
        } : undefined
      },
      include: {
        images: true,
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.product.findUnique(
      {
        where: { id },
      }
    );

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
