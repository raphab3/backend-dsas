import env from '@config/env';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { SystemMonitor } from 'watchdock';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.enableCors({
    methods: ['*'],
  });

  const monitor = new SystemMonitor({
    interval: '*/5 * * * *',
    application: {
      name: 'SigSaude API',
      metadata: {
        version: '1.0.0',
      },
    },
    providers: [
      {
        type: 'discord',
        webhookUrl: env.DISCORD_WEBHOOK_URL,
        username: 'SigSaúde API',
      },
    ],
    notifications: {
      cpu: {
        value: 80,
        duration: 5,
        notify: true,
      },
      memory: {
        value: 90,
        notify: true,
      },
      disk: {
        value: 85,
        notify: true,
      },
      status: {
        notifyOn: ['unhealthy', 'degraded'],
      },
    },
  });

  monitor.start();

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'v',
  });

  const config = new DocumentBuilder()
    .setTitle('SigSaúde API')
    .setDescription('API do sistema de gestão de saúde')
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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(env.SERVER_PORT, '0.0.0.0');
}
bootstrap();
