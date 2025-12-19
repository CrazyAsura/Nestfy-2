import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { RisksModule } from './modules/risks/risks.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { WishlistItemsModule } from './modules/wishlist-items/wishlist-items.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartItemsModule } from './modules/cart-items/cart-items.module';
import { CartsModule } from './modules/carts/carts.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductImagesModule } from './modules/product-images/product-images.module';
import { PhonesModule } from './modules/phones/phones.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      introspection: true,

      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          footer: false,
        })
      ]

    }),
    UsersModule,
    ProductsModule,
    WishlistsModule,
    MaterialsModule,
    RisksModule,
    ChatbotModule,
    AddressesModule,
    PhonesModule,
    CategoriesModule,
    BrandsModule,
    ReviewsModule,
    CartsModule,
    OrdersModule,
    ProductImagesModule,
    CartItemsModule,
    OrderItemsModule,
    WishlistItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
