import { Controller, Get, Param, Res, UseGuards, Query } from '@nestjs/common';
import { Response } from 'express';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../constants/enums';

@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('boleto/:orderId')
  async getBoleto(@Param('orderId') orderId: string, @Res() res: Response) {
    const buffer = await this.financeService.generateBoleto(orderId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=boleto-${orderId}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('invoice/:orderId')
  @UseGuards(JwtAuthGuard)
  async getInvoice(@Param('orderId') orderId: string, @Res() res: Response) {
    const buffer = await this.financeService.generateInvoice(orderId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=nf-${orderId}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('stats')
  async getStats() {
    return this.financeService.getFinancialStats();
  }
}
