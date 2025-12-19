import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsResolver } from './brands.resolver';

@Module({
  providers: [BrandsResolver, BrandsService],
})
export class BrandsModule {}
