import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SeedService } from './modules/admin/seed.service';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';
import * as dotenv from 'dotenv';

// Carrega o .env
dotenv.config();
// Tenta carregar de backend/.env se existir (útil para desenvolvimento local na raiz do monorepo)
const backendEnv = join(process.cwd(), 'backend', '.env');
dotenv.config({ path: backendEnv });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const logger = new Logger('Bootstrap');

  // Executar Seed automático
  const seedService = app.get(SeedService);
  await seedService.seedAll();

  // Confiar em proxies (necessário para Railway/Vercel)
  app.set('trust proxy', 1);

  // Configurar Redis Adapter para WebSockets se configurado
  if (process.env.REDIS_HOST || process.env.REDIS_URL) {
    const redisIoAdapter = new RedisIoAdapter(app);
    try {
      await redisIoAdapter.connectToRedis();
      app.useWebSocketAdapter(redisIoAdapter);
      console.log('Redis Adapter for WebSockets initialized');
    } catch (error) {
      console.error('Failed to initialize Redis Adapter for WebSockets', error);
    }
  }

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  // Configurar pasta de uploads como estática
  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  
  const allowedOrigins = [
    'https://nestfy-1.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    ...allowedOriginsEnv.split(',').map(o => o.trim()).filter(o => o !== '')
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Se não houver origin (ex: mobile apps ou ferramentas de teste), permite
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some(allowed => {
        if (!allowed) return false;
        if (allowed === origin) return true;
        // Suporte para subdomínios do vercel e outros padrões
        if (allowed.includes('.vercel.app') && origin.endsWith('.vercel.app')) return true;
        if (allowed.includes('onrender.com') && origin.includes('onrender.com')) return true;
        return false;
      });

      if (isAllowed || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        // Em vez de null, retornamos false explicitamente
        callback(null, false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api', { exclude: ['/'] });

  const config = new DocumentBuilder()
  .setTitle('Ecommerce API')
  .setDescription('The Ecommerce API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 8080;
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${port}`;
  await app.listen(port);
  console.log(`Backend is running on: ${backendUrl}`);
}
bootstrap();
