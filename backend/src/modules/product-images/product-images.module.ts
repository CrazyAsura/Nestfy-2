import { Module } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { ProductImagesResolver } from './product-images.resolver';

@Module({
  providers: [ProductImagesResolver, ProductImagesService],
})
export class ProductImagesModule {}
