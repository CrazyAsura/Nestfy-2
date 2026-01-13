
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

    // 2. Seed Categorias (10)
    const categoriasData = [
      { name: 'Eletrônicos', slug: 'eletronicos' },
      { name: 'Roupas', slug: 'roupas' },
      { name: 'Casa e Jardim', slug: 'casa-e-jardim' },
      { name: 'Esportes', slug: 'esportes' },
      { name: 'Beleza', slug: 'beleza' },
      { name: 'Brinquedos', slug: 'brinquedos' },
      { name: 'Livros', slug: 'livros' },
      { name: 'Automotivo', slug: 'automotivo' },
      { name: 'Alimentos', slug: 'alimentos' },
      { name: 'Saúde', slug: 'saude' },
    ];

    const categorias: Category[] = [];
    for (const catData of categoriasData) {
      let cat = await categoryRepository.findOne({ where: { slug: catData.slug } });
      if (!cat) {
        cat = categoryRepository.create(catData);
        cat = await categoryRepository.save(cat);
        console.log(`Categoria criada: ${cat.name}`);
      }
      categorias.push(cat);
    }

    // 3. Seed Produtos (10)
    const produtosData = [
      { name: 'Smartphone Pro', price: 2999.90, stock: 50, sku: 'SM-PRO-01', description: 'O melhor smartphone do mercado.' },
      { name: 'Camiseta Algodão Premium', price: 89.90, stock: 100, sku: 'TSH-01', description: 'Conforto e estilo.' },
      { name: 'Robô Aspirador X1', price: 1200.00, stock: 20, sku: 'ROB-X1', description: 'Limpeza inteligente para sua casa.' },
      { name: 'Bola de Futebol Oficial', price: 150.00, stock: 30, sku: 'BALL-01', description: 'Para os craques do gramado.' },
      { name: 'Kit Maquiagem Completo', price: 250.00, stock: 15, sku: 'MKP-KIT', description: 'Realce sua beleza.' },
      { name: 'Lego Star Wars', price: 450.00, stock: 10, sku: 'LEGO-SW', description: 'Diversão para todas as idades.' },
      { name: 'O Senhor dos Anéis - Edição Especial', price: 120.00, stock: 40, sku: 'BOOK-LOTR', description: 'Um clássico da literatura.' },
      { name: 'Pneu Aro 15', price: 380.00, stock: 24, sku: 'TIRE-15', description: 'Segurança e durabilidade.' },
      { name: 'Café Gourmet 500g', price: 45.00, stock: 200, sku: 'COF-GUR', description: 'Sabor intenso e aroma marcante.' },
      { name: 'Multivitamínico A-Z', price: 75.00, stock: 80, sku: 'VIT-AZ', description: 'Sua dose diária de saúde.' },
    ];

    for (let i = 0; i < produtosData.length; i++) {
      const prodData = produtosData[i];
      let prod = await productRepository.findOne({ where: { sku: prodData.sku } });
      if (!prod) {
        prod = productRepository.create({
          ...prodData,
          slug: prodData.name.toLowerCase().replace(/ /g, '-'),
          categoryId: categorias[i % categorias.length].id,
          isActive: true
        });
        await productRepository.save(prod);
        console.log(`Produto criado: ${prod.name}`);
      }
    }

    console.log('✅ Seed finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seed();
