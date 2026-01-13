import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { rastrearEncomendas } from 'correios-brasil';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  async trackOrder(trackingCode: string) {
    if (!trackingCode) {
      throw new BadRequestException('Código de rastreio é obrigatório');
    }

    try {
      this.logger.log(`Rastreando encomenda: ${trackingCode}`);
      
      // correios-brasil espera um array de códigos
      const response = await rastrearEncomendas([trackingCode]);
      
      if (!response || response.length === 0) {
        return {
          trackingCode,
          status: 'NOT_FOUND',
          events: [],
          message: 'Nenhum dado encontrado para este código.'
        };
      }

      const trackingData = response[0];
      
      // Formatar os dados para um padrão mais limpo
      return {
        trackingCode,
        events: trackingData.eventos || [],
        lastStatus: trackingData.eventos?.[0]?.status || 'Desconhecido',
        lastLocation: trackingData.eventos?.[0]?.local || 'N/A',
        lastUpdate: trackingData.eventos?.[0]?.data || null,
      };
    } catch (error) {
      this.logger.error(`Erro ao rastrear encomenda ${trackingCode}: ${error.message}`);
      throw new BadRequestException('Erro ao consultar os Correios. Verifique o código e tente novamente.');
    }
  }
}
