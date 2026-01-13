import { Controller, Post, Body, UseGuards, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
    @CurrentUser() user: any
  ) {
    return this.paymentService.createCheckoutSession(createCheckoutSessionDto, user.id);
  }

  @Post('webhook')
  handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>
  ) {
    return this.paymentService.handleWebhook(signature, (req as any).rawBody);
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm-payment')
  confirmPayment(
    @Body('orderId') orderId: string,
    @CurrentUser() user: any
  ) {
    return this.paymentService.confirmPayment(orderId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('session-status')
  getSessionStatus(@Body('sessionId') sessionId: string) {
    return this.paymentService.getSessionStatus(sessionId);
  }
}
