import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private prismaExtended: any;

  constructor() {
    super({
      accelerateUrl: process.env.PRISMA_DATABASE_URL,
      log: ['error', 'warn'],
    });
    this.prismaExtended = (this as any).$extends(withAccelerate());
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  get client() {
    return this.prismaExtended;
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
