import { Module } from '@nestjs/common';
import { CjDropshippingService } from './cj-dropshipping.service';
import { CjDropshippingController } from './cj-dropshipping.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [CjDropshippingController],
  providers: [CjDropshippingService],
  exports: [CjDropshippingService],
})
export class CjDropshippingModule {}
