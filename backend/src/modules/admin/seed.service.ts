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
      // Removido o seed de produtos e categorias para manter o ambiente limpo conforme solicitado
      // const categories = await this.seedCategories();
      // await this.seedProducts(categories);
      
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
}
