import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { CjDropshippingService } from './cj-dropshipping.service';

@Controller('cj-dropshipping')
export class CjDropshippingController {
  constructor(private readonly cjService: CjDropshippingService) {}

  @Get('products')
  async getProducts(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('search') search?: string,
  ) {
    return this.cjService.getProducts(page, size, search);
  }

  @Get('products/:pid')
  async getProductDetail(@Param('pid') pid: string) {
    return this.cjService.getProductDetail(pid);
  }

  @Get('inventory/:pid')
  async getInventory(@Param('pid') pid: string) {
    return this.cjService.getInventory(pid);
  }

  @Post('import')
  async importProduct(@Body('pid') pid: string, @Body('categoryId') categoryId: string) {
    return this.cjService.importProduct(pid, categoryId);
  }
}
