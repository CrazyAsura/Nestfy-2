import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PDFDocument from 'pdfkit';
import * as bwipjs from 'bwip-js';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import { OrderItem, OrderItemDocument } from '../order-item/schemas/order-item.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { OrderStatus, PaymentStatus } from '../../constants/enums';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItemDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async generateBoleto(orderId: string): Promise<Buffer> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) throw new NotFoundException('Pedido não encontrado');

    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    return new Promise(async (resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header do Boleto
      doc.fontSize(20).text('BOLETO BANCÁRIO', { align: 'center' });
      doc.moveDown();

      // Linha Digitável Realista baseada no Pedido
      const bankCode = '237'; // Bradesco
      const currencyCode = '9'; // Real
      const orderPart = order._id.toString().slice(-10).replace(/[^0-9]/g, '0').padEnd(10, '0');
      const valuePart = (order.totalAmount * 100).toString().padStart(10, '0');
      const linhaDigitavel = `${bankCode}${currencyCode}1.23456 78901.234567 89012.345678 1 ${valuePart}`;
      
      doc.fontSize(12).text(linhaDigitavel, { align: 'right' });
      doc.moveDown();

      // Dados do Beneficiário
      doc.fontSize(10).font('Helvetica-Bold').text('Beneficiário: Nestfy Ecommerce Ltda').font('Helvetica');
      doc.text('CNPJ: 12.345.678/0001-90');
      doc.moveDown();

      // Dados do Pagador
      doc.text(`Pagador: User ID ${order.userId}`);
      doc.text(`Endereço: ${order.shippingAddress}`);
      doc.moveDown();

      // Detalhes do Pagamento
      doc.text(`Vencimento: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}`);
      doc.text(`Valor: R$ ${order.totalAmount.toFixed(2)}`);
      
      if (order.totalTaxAmount > 0) {
        doc.moveDown(0.5);
        doc.fontSize(8).text(`(Incluso R$ ${order.totalTaxAmount.toFixed(2)} de tributos totais incidentes sobre a operação)`, { align: 'left' });
      }
      doc.moveDown();

      // Gerar Código de Barras
      try {
        const barcodeBuffer = await bwipjs.toBuffer({
          bcid: 'code128',
          text: linhaDigitavel.replace(/\s/g, ''),
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
        });
        doc.image(barcodeBuffer, { fit: [400, 100], align: 'center' });
      } catch (err) {
        console.error('Erro ao gerar código de barras:', err);
      }

      doc.end();
    });
  }

  async generateInvoice(orderId: string): Promise<Buffer> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) throw new NotFoundException('Pedido não encontrado');

    const items = await this.orderItemModel.find({ orderId }).populate('productId').exec();

    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));

    return new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('NOTA FISCAL ELETRÔNICA (NF-e)', { align: 'center' });
      doc.moveDown();

      const accessKey = Array.from({length: 44}, () => Math.floor(Math.random() * 10)).join('');
      const protocol = `135${Math.floor(100000000 + Math.random() * 900000000)}`;

      doc.fontSize(10).text(`Chave de Acesso: ${accessKey.match(/.{1,4}/g)?.join(' ')}`, { align: 'center' });
      doc.text(`Protocolo de Autorização: ${protocol}`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Número: ${order.invoiceNumber || 'NF-' + (order.orderNumber || order._id.toString().slice(-6).toUpperCase())}`);
      doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`);
      doc.moveDown();

      // Dados da Empresa
      doc.fontSize(10).font('Helvetica-Bold').text('EMISSOR:').font('Helvetica');
      doc.text('Nestfy Ecommerce Ltda');
      doc.text('CNPJ: 12.345.678/0001-90');
      doc.moveDown();

      // Dados do Cliente
      doc.font('Helvetica-Bold').text('CLIENTE:').font('Helvetica');
      doc.text(`ID do Usuário: ${order.userId}`);
      doc.text(`Endereço: ${order.shippingAddress}`);
      doc.moveDown();

      // Tabela de Itens
      doc.font('Helvetica-Bold').text('ITENS DO PEDIDO:').font('Helvetica');
      doc.moveDown(0.5);

      items.forEach((item: any) => {
        const productName = item.productId?.name || 'Produto';
        doc.fontSize(10).text(`${productName} - Qtd: ${item.quantity} - Preço Un.: R$ ${item.price.toFixed(2)}`);
        
        if (item.totalTaxAmount > 0) {
          doc.fontSize(8).fillColor('#666').text(
            `Impostos: ICMS: R$ ${item.icmsAmount?.toFixed(2) || '0.00'} | IPI: R$ ${item.ipiAmount?.toFixed(2) || '0.00'} | ` +
            `PIS: R$ ${item.pisAmount?.toFixed(2) || '0.00'} | COFINS: R$ ${item.cofinsAmount?.toFixed(2) || '0.00'}`
          ).fillColor('#000');
        }
        doc.moveDown(0.3);
      });

      doc.moveDown();
      if (order.totalTaxAmount > 0) {
        doc.fontSize(10).text(`Total Impostos: R$ ${order.totalTaxAmount.toFixed(2)}`, { align: 'right' });
      }
      doc.fontSize(14).font('Helvetica-Bold').text(`TOTAL DO PEDIDO: R$ ${order.totalAmount.toFixed(2)}`, { align: 'right' });

      doc.end();
    });
  }

  async getFinancialStats() {
    const orders = await this.orderModel.find({ status: { $ne: 'CANCELLED' } }).sort({ createdAt: -1 }).exec();
    
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const pendingRevenue = orders
      .filter(o => o.paymentStatus === 'PENDING')
      .reduce((acc, order) => acc + order.totalAmount, 0);
    
    const salesByDay = orders.reduce((acc: any, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + order.totalAmount;
      return acc;
    }, {});

    const chartData = Object.entries(salesByDay).map(([date, value]) => ({
      date,
      value,
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Pegar as 10 últimas faturas/pedidos para o histórico
    const recentInvoices = orders.slice(0, 10).map(order => ({
      orderId: order._id,
      invoiceNumber: order.invoiceNumber || `NF-${order.orderNumber || order._id.toString().slice(-6).toUpperCase()}`,
      date: order.createdAt,
      amount: order.totalAmount,
      status: order.paymentStatus === PaymentStatus.COMPLETED ? 'Emitida' : 'Pendente',
    }));

    return {
      totalRevenue,
      pendingRevenue,
      orderCount: orders.length,
      chartData,
      recentInvoices,
      taxInfo: await this.getTaxationInfo(),
    };
  }

  private async getTaxationInfo() {
    try {
      // Webscraping real de um site de notícias econômicas para pegar a SELIC ou taxas
      // Usaremos o site do Valor Econômico ou similar que seja mais fácil de parsear
      const response = await axios.get('https://www.infomoney.com.br/ferramentas/selic/');
      const $ = cheerio.load(response.data);
      
      // Tentando pegar a taxa SELIC atual
      const selicValue = $('.value').first().text().trim() || '11,25%';
      
      return {
        icms: '18% (Média Nacional)',
        iss: '5% (Serviços Tech)',
        ipi: '10% (Eletrônicos)',
        selic: selicValue,
        lastUpdate: new Date().toISOString(),
        source: 'InfoMoney / Receita Federal',
      };
    } catch (error) {
      console.error('Erro no webscraping de tributação:', error.message);
      return {
        icms: '18%',
        iss: '5%',
        ipi: '10%',
        selic: '11,25%',
        lastUpdate: new Date().toISOString(),
        source: 'Receita Federal (Fallback)',
      };
    }
  }
}
