import * as mongoose from 'mongoose';
import * as argon from 'argon2';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { UserSchema } from './src/modules/user/schemas/user.schema';
import { ProductSchema } from './src/modules/product/schemas/product.schema';
import { CategorySchema } from './src/modules/category/schemas/category.schema';
import { Role, UserType } from './src/constants/enums';

dotenv.config({ path: join(__dirname, '.env') });

async function seed() {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
        console.error('MONGODB_URI not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('DataSource inicializado para seed (Mongoose).');

        const UserModel = mongoose.model('User', UserSchema);
        const CategoryModel = mongoose.model('Category', CategorySchema);
        const ProductModel = mongoose.model('Product', ProductSchema);

        // 1. Seed Admin
        const adminEmail = 'adminnestfy@gmail.com'.toLowerCase();
        const adminPassword = 'None@3355';

        const existingAdmin = await UserModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            await UserModel.deleteOne({ _id: existingAdmin._id });
        }

        const hashedPassword = await argon.hash(adminPassword);
        const admin = new UserModel({
            name: 'Administrador Nestfy',
            email: adminEmail,
            password: hashedPassword,
            role: Role.ADMIN,
            userType: UserType.INDIVIDUAL,
            document: '00000000000',
            isActive: true
        });
        await admin.save();
        console.log('✅ Administrador recriado com sucesso!');

        // 1.1 Seed User Leon
        const leonEmail = 'leoncdzt@gmail.com'.toLowerCase();
        const leonPassword = 'password123';

        const existingLeon = await UserModel.findOne({ email: leonEmail });
        if (existingLeon) {
            await UserModel.deleteOne({ _id: existingLeon._id });
        }

        const hashedLeonPassword = await argon.hash(leonPassword);
        const leonUser = new UserModel({
            name: 'Leon',
            email: leonEmail,
            password: hashedLeonPassword,
            role: Role.USER,
            userType: UserType.INDIVIDUAL,
            document: '11111111111',
            isActive: true
        });
        await leonUser.save();
        console.log('✅ Usuário Leon criado com sucesso!');

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

        const categorias: any[] = [];
        for (const catData of categoriasData) {
            let cat = await CategoryModel.findOne({ slug: catData.slug });
            if (!cat) {
                cat = new CategoryModel(catData);
                await cat.save();
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
            let prod = await ProductModel.findOne({ sku: prodData.sku });
            if (!prod) {
                const newProd = new ProductModel({
                    ...prodData,
                    slug: prodData.name.toLowerCase().replace(/ /g, '-'),
                    categoryId: categorias[i % categorias.length]._id,
                    isActive: true
                });
                await newProd.save();
                console.log(`Produto criado: ${newProd.name}`);
            }
        }

        console.log('✅ Seed finalizado com sucesso!');
    } catch (error) {
        console.error('❌ Erro no seed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
