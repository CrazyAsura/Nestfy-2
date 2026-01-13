import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ProductService } from '../product/product.service';

@Injectable()
export class CjDropshippingService {
  private readonly logger = new Logger(CjDropshippingService.name);
  private readonly baseUrl = 'https://cj-dropshipping.com/api/v1';

  constructor(
    private configService: ConfigService,
    private productService: ProductService,
  ) {}

  private get apiKey() {
    return this.configService.get<string>('CJ_API_KEY') || 'CJ5072663@api@6866cb86dee7404a905c731b8ff37aa8';
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'CJ-Access-Token': this.apiKey,
    };
  }

  async getProducts(page: number = 1, size: number = 20) {
    try {
      const response = await axios.get(`${this.baseUrl}/product/list`, {
        headers: this.headers,
        params: { pageNum: page, pageSize: size },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching products from CJ: ${error.message}`);
      throw error;
    }
  }

  async getProductDetail(pid: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/product/detail`, {
        headers: this.headers,
        params: { pid },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching product detail from CJ: ${error.message}`);
      throw error;
    }
  }

  async getInventory(pid: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/product/inventory`, {
        headers: this.headers,
        params: { pid },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching inventory from CJ: ${error.message}`);
      throw error;
    }
  }

  async importProduct(pid: string, categoryId: string) {
    try {
      const cjProduct = await this.getProductDetail(pid);
      if (!cjProduct || !cjProduct.data) {
        throw new NotFoundException('Product not found in CJ');
      }

      const data = cjProduct.data;

      const productDto = {
        name: data.productName,
        description: data.description || data.productName,
        price: data.sellPrice || 0,
        categoryId: categoryId,
        stock: data.inventory || 0,
        sku: data.productSku,
        weight: data.productWeight,
        isDropshipping: true,
        cjProductId: data.pid,
        vendor: 'CJ Dropshipping',
        costPrice: data.costPrice || 0,
        cjSku: data.productSku,
        images: data.productImage ? [{ url: data.productImage, isMain: true }] : [],
      };

      return await this.productService.create(productDto);
    } catch (error) {
      this.logger.error(`Error importing product from CJ: ${error.message}`);
      throw error;
    }
  }
}
