import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { Risk, RiskSchema } from './schemas/risk.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Risk.name, schema: RiskSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [RiskController],
  providers: [RiskService],
  exports: [RiskService],
})
export class RiskModule {}
