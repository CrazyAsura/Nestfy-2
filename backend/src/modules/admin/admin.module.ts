import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { SeedService } from './seed.service';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { Review, ReviewSchema } from '../review/schemas/review.schema';
import { LogModule } from '../log/log.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    LogModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, SeedService],
  exports: [SeedService],
})
export class AdminModule {}
