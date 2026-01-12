import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { RefreshToken, RefreshTokenSchema } from '../refresh-token/schemas/refresh-token.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Address, AddressSchema } from '../address/schemas/address.schema';
import { Phone, PhoneSchema } from '../phone/schemas/phone.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mudar_depois_para_algo_seguro',
      signOptions: { 
        expiresIn: (process.env.JWT_EXPIRES_IN as any) || '7d' 
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Address.name, schema: AddressSchema },
      { name: Phone.name, schema: PhoneSchema },
    ]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
