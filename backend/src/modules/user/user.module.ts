import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Address, AddressSchema } from '../address/schemas/address.schema';
import { Phone, PhoneSchema } from '../phone/schemas/phone.schema';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';
import { RefreshToken, RefreshTokenSchema } from '../refresh-token/schemas/refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
      { name: Phone.name, schema: PhoneSchema },
      { name: Cart.name, schema: CartSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
