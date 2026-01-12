import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
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
import { PaymentModule } from './modules/payment/payment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AdminModule } from './modules/admin/admin.module';
import { LogModule } from './modules/log/log.module';
import { FinanceModule } from './modules/finance/finance.module';
import { UserActivityInterceptor } from './common/middleware/interceptors/userActivityInterceptor';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', 'backend/.env'],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        // Se não houver REDIS_HOST definido, usamos o store padrão (em memória)
        // Isso evita erros de conexão em ambientes de desenvolvimento sem Redis
        if (!process.env.REDIS_HOST && !process.env.REDIS_URL) {
          console.log('Redis não configurado. Usando cache em memória.');
          return {
            ttl: 60 * 60,
          };
        }

        try {
          const store = await redisStore({
            socket: {
              host: process.env.REDIS_HOST || 'localhost',
              port: parseInt(process.env.REDIS_PORT || '6379'),
            },
            password: process.env.REDIS_PASSWORD || undefined,
            ttl: 60 * 60,
          });
          return { store };
        } catch (error) {
          console.error('Erro ao conectar ao Redis. Usando cache em memória.', error);
          return {
            ttl: 60 * 60,
          };
        }
      },
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomerce';
        console.log(`[Mongoose] Tentando conectar ao MongoDB Atlas...`);
        return {
          uri,
          serverSelectionTimeoutMS: 5000, // Timeout após 5 segundos
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('[Mongoose] Conectado com sucesso ao MongoDB Atlas!');
            });
            connection.on('error', (error) => {
              console.error('[Mongoose] Erro na conexão:', error);
            });
            return connection;
          },
        };
      },
    }),

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
    PaymentModule,
    NotificationModule,
    AdminModule,
    LogModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserActivityInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
