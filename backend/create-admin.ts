import * as mongoose from 'mongoose';
import * as argon from 'argon2';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { UserSchema } from './src/modules/user/schemas/user.schema';
import { Role, UserType } from './src/constants/enums';

dotenv.config({ path: join(__dirname, '.env') });

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI not found in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB!');

    const UserModel = mongoose.model('User', UserSchema);

    const adminEmail = 'adminnestfy@gmail.com';
    const adminPassword = 'None@3355';

    const existingAdmin = await UserModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      
      const hashedPassword = await argon.hash(adminPassword);
      await UserModel.updateOne(
        { _id: existingAdmin._id },
        { 
          $set: { 
            password: hashedPassword,
            role: Role.ADMIN 
          } 
        }
      );
      console.log('Admin user updated successfully!');
    } else {
      const hashedPassword = await argon.hash(adminPassword);

      const admin = new UserModel({
        name: 'Admin Nestfy',
        email: adminEmail,
        password: hashedPassword,
        document: '00000000000',
        role: Role.ADMIN,
        userType: UserType.INDIVIDUAL,
        isActive: true,
      });

      await admin.save();
      console.log('Admin user created successfully!');
    }
  } catch (err) {
    console.error('Error during admin creation', err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
