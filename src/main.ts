import env from '@config/env';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EntityExceptionFilter } from '@shared/interceptors/EntityPropertyNotFoundError';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, trustProxy: true }),
  );

  app.useGlobalFilters(new EntityExceptionFilter());

  app.enableCors({
    methods: ['*'],
  });

  const config = new DocumentBuilder()
    .setTitle('SigSaúde API')
    .setDescription('API do sistema de gestão de saúde')
    .addServer(`${env.API_URL}/api/v1`, `${env.NODE_ENV} - server`)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Token',
        name: 'JWT',
      },
      'JWT',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      showMutatedRequest: true,
      docExpansion: 'none',
    },
  });

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.register(fastifyCsrfProtection);

  await app.listen(env.SERVER_PORT, '0.0.0.0');
}
bootstrap();
