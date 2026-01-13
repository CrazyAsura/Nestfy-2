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
        if (!existingAdmin) {
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
            console.log('✅ Administrador criado com sucesso!');
        } else {
            console.log('ℹ️ Administrador já existe, pulando seed.');
        }

        console.log('✅ Seed finalizado com sucesso (apenas Admin).');
    } catch (error) {
        console.error('❌ Erro no seed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
