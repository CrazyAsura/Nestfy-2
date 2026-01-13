import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as argon from 'argon2';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Category, CategoryDocument } from '../category/schemas/category.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Role, UserType } from '../../constants/enums';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async seedAll() {
    this.logger.log('Iniciando processo de Seed automático...');
    
    try {
      await this.seedUsers();
      const categories = await this.seedCategories();
      await this.seedProducts(categories);
      
      this.logger.log('✅ Processo de Seed finalizado com sucesso!');
    } catch (error) {
      this.logger.error('❌ Erro durante o processo de Seed:', error);
    }
  }

  private async seedUsers() {
    // 1. Seed Admin
    const adminEmail = 'adminnestfy@gmail.com'.toLowerCase();
    const adminPassword = 'None@3355';
    const hashedAdminPassword = await argon.hash(adminPassword);

    const existingAdmin = await this.userModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = new this.userModel({
        name: 'Administrador Nestfy',
        email: adminEmail,
        password: hashedAdminPassword,
        role: Role.ADMIN,
        userType: UserType.INDIVIDUAL,
        document: '00000000000',
        isActive: true
      });
      await admin.save();
      this.logger.log(`✅ Usuário Admin criado: ${adminEmail}`);
    } else {
      // Opcional: Atualizar outros campos se necessário, mas EVITAR resetar a senha se já existir
      this.logger.log(`ℹ️ Usuário Admin já existe: ${adminEmail} (senha preservada)`);
    }
  }

  private async seedCategories(): Promise<CategoryDocument[]> {
    const categoriasData = [
      { name: 'Eletrônicos', slug: 'eletronicos', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60' },
      { name: 'Roupas', slug: 'roupas', imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=60' },
      { name: 'Casa e Jardim', slug: 'casa-e-jardim', imageUrl: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=500&auto=format&fit=crop&q=60' },
      { name: 'Esportes', slug: 'esportes', imageUrl: 'https://images.unsplash.com/photo-1461896756984-33fd055b19c2?w=500&auto=format&fit=crop&q=60' },
      { name: 'Beleza', slug: 'beleza', imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60' },
      { name: 'Brinquedos', slug: 'brinquedos', imageUrl: 'https://images.unsplash.com/photo-1531315630201-bb15b9966a1c?w=500&auto=format&fit=crop&q=60' },
      { name: 'Livros', slug: 'livros', imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format&fit=crop&q=60' },
      { name: 'Automotivo', slug: 'automotivo', imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format&fit=crop&q=60' },
      { name: 'Alimentos', slug: 'alimentos', imageUrl: 'https://images.unsplash.com/photo-1506617564039-2f3b650ad755?w=500&auto=format&fit=crop&q=60' },
      { name: 'Saúde', slug: 'saude', imageUrl: 'https://images.unsplash.com/photo-1505751172107-5739a00723a5?w=500&auto=format&fit=crop&q=60' },
    ];

    const categories: CategoryDocument[] = [];
    for (const catData of categoriasData) {
      let cat = await this.categoryModel.findOne({ slug: catData.slug });
      if (!cat) {
        cat = new this.categoryModel(catData);
        await cat.save();
        this.logger.log(`Categoria criada: ${cat.name}`);
      } else if (!cat.imageUrl) {
        cat.imageUrl = catData.imageUrl;
        await cat.save();
        this.logger.log(`Categoria atualizada com imagem: ${cat.name}`);
      }
      categories.push(cat);
    }
    return categories;
  }

  private async seedProducts(categories: CategoryDocument[]) {
    const produtosData = [
      { 
        name: 'Smartphone Pro', 
        price: 2999.90, 
        discountPrice: 2499.00,
        stock: 50, 
        sku: 'SM-PRO-01', 
        description: 'O melhor smartphone do mercado.',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D'
      },
      { 
        name: 'Camiseta Algodão Premium', 
        price: 89.90, 
        discountPrice: 69.90,
        stock: 100, 
        sku: 'TSH-01', 
        description: 'Conforto e estilo.',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dCUyMHNoaXJ0fGVufDB8fDB8fHww'
      },
      { 
        name: 'Robô Aspirador X1', 
        price: 1200.00, 
        discountPrice: 999.00,
        stock: 20, 
        sku: 'ROB-X1', 
        description: 'Limpeza inteligente para sua casa.',
        imageUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cm9ib3QlMjB2YWN1dW18ZW58MHx8MHx8fDA%3D'
      },
      { 
        name: 'Bola de Futebol Oficial', 
        price: 150.00, 
        discountPrice: 120.00,
        stock: 30, 
        sku: 'BALL-01', 
        description: 'Para os craques do gramado.',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29jY2VyJTIwYmFsbHxlbnwwfHwwfHx8MA%3D%3D'
      },
      { 
        name: 'Kit Maquiagem Completo', 
        price: 250.00, 
        discountPrice: 199.90,
        stock: 15, 
        sku: 'MKP-KIT', 
        description: 'Realce sua beleza.',
        imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFrZXVwfGVufDB8fDB8fHww'
      },
      { 
        name: 'Lego Star Wars', 
        price: 450.00, 
        discountPrice: 399.00,
        stock: 10, 
        sku: 'LEGO-SW', 
        description: 'Diversão para todas as idades.',
        imageUrl: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVnb3xlbnwwfHwwfHx8MA%3D%3D'
      },
      { 
        name: 'O Senhor dos Anéis - Edição Especial', 
        price: 120.00, 
        discountPrice: 95.00,
        stock: 40, 
        sku: 'BOOK-LOTR', 
        description: 'Um clássico da literatura.',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJvb2t8ZW58MHx8MHx8fDA%3D'
      },
      { 
        name: 'Pneu Aro 15', 
        price: 380.00, 
        discountPrice: 320.00,
        stock: 24, 
        sku: 'TIRE-15', 
        description: 'Segurança e durabilidade.',
        imageUrl: 'https://images.unsplash.com/photo-1578844541313-d30805091871?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGlyZXxlbnwwfHwwfHx8MA%3D%3D'
      },
      { 
        name: 'Café Gourmet 500g', 
        price: 45.00, 
        discountPrice: 35.00,
        stock: 200, 
        sku: 'COF-GUR', 
        description: 'Sabor intenso e aroma marcante.',
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29mZmVlfGVufDB8fDB8fHww'
      },
      { 
        name: 'Multivitamínico A-Z', 
        price: 75.00, 
        discountPrice: 59.90,
        stock: 80, 
        sku: 'VIT-AZ', 
        description: 'Sua dose diária de saúde.',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dml0YW1pbnN8ZW58MHx8MHx8fDA%3D'
      },
    ];

    for (let i = 0; i < produtosData.length; i++) {
      const prodData = produtosData[i];
      let prod = await this.productModel.findOne({ sku: prodData.sku });
      if (!prod) {
        const newProd = new this.productModel({
          ...prodData,
          slug: prodData.name.toLowerCase().replace(/ /g, '-'),
          categoryId: categories[i % categories.length].id,
          images: [{ url: prodData.imageUrl, isMain: true }],
          isActive: true
        });
        await newProd.save();
        this.logger.log(`Produto criado: ${newProd.name}`);
      } else {
        // Atualizar imagens e desconto se o produto já existir
        prod.discountPrice = prodData.discountPrice;
        if (!prod.imageUrl || prod.images.length === 0) {
          prod.imageUrl = prodData.imageUrl;
          prod.images = [{ url: prodData.imageUrl, isMain: true }];
        }
        await prod.save();
        this.logger.log(`Produto atualizado: ${prod.name}`);
      }
    }
  }
}
