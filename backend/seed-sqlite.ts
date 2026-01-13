
import { DataSource } from 'typeorm';
import * as argon from 'argon2';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { User } from './src/modules/user/entities/user.entity';
import { Product } from './src/modules/product/entities/product.entity';
import { Category } from './src/modules/category/entities/category.entity';
import { Brand } from './src/modules/brand/entities/brand.entity';
import { Material } from './src/modules/material/entities/material.entity';
import { Risk } from './src/modules/risk/entities/risk.entity';
import { Role, UserType } from './src/constants/enums';

dotenv.config();

async function seed() {
  let databaseUrl = process.env.DATABASE_URL || 'dev.db';
  databaseUrl = databaseUrl.replace('file:', '');

  const absoluteDbPath = path.isAbsolute(databaseUrl) 
    ? databaseUrl 
    : path.resolve(__dirname, databaseUrl);

  console.log(`[SEED] Conectando ao SQLite em: ${absoluteDbPath}`);

  const dataSource = new DataSource({
    type: 'sqlite',
    database: absoluteDbPath,
    entities: [path.join(__dirname, 'src/modules/**/*.entity.ts')],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('DataSource inicializado para seed.');

    const userRepository = dataSource.getRepository(User);
    const categoryRepository = dataSource.getRepository(Category);
    const productRepository = dataSource.getRepository(Product);

    // 1. Seed Admin
    const adminEmail = 'adminnestfy@gmail.com'.toLowerCase();
    const adminPassword = 'None@3355';

    // Deletar para garantir recriação limpa
    await userRepository.delete({ email: adminEmail });
    
    const hashedPassword = await argon.hash(adminPassword);
    const admin = userRepository.create({
      name: 'Administrador Nestfy',
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      userType: UserType.INDIVIDUAL,
      document: '00000000000',
      isActive: true
    });
    await userRepository.save(admin);
    console.log('✅ Administrador recriado com sucesso!');

    console.log('✅ Seed finalizado com sucesso (apenas Admin).');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seed();
