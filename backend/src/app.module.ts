import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { AddressModule } from './modules/address/address.module';
import { PhoneModule } from './modules/phone/phone.module';
import { ProductModule } from './modules/product/product.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';
import { ReviewModule } from './modules/review/review.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { WishlistItemModule } from './modules/wishlist-item/wishlist-item.module';
import { MaterialModule } from './modules/material/material.module';
import { RiskModule } from './modules/risk/risk.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    RefreshTokenModule,
    AddressModule,
    PhoneModule,
    ProductModule,
    ProductImageModule,
    CategoryModule,
    BrandModule,
    ReviewModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    WishlistModule,
    WishlistItemModule,
    MaterialModule,
    RiskModule,
    ChatbotModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
