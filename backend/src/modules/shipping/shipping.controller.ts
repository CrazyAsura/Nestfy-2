import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('track/:code')
  async trackOrder(@Param('code') code: string) {
    if (!code) {
      throw new BadRequestException('O código de rastreio é obrigatório');
    }
    return this.shippingService.trackOrder(code);
  }
}
