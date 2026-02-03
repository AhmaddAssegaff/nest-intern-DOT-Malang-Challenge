import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from './config';
import { createDocument } from './swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<ConfigSchema['app']>('app');

  const env = appConfig.mode;
  const PORT = appConfig.port;

  const defaultVersion = appConfig.defaultVersion;
  const enableVersion = appConfig.enableVersion;

  const globalPrefix = appConfig.globalPrefix;
  const versionPrefix = appConfig.versionPrefix;

  app.setGlobalPrefix(globalPrefix);

  if (enableVersion) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion,
      prefix: versionPrefix,
    });
  }

  if (env === 'development') {
    createDocument(app);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(appConfig.port);

  Logger.log(`Running in ${env} mode`, 'Bootstrap');
  Logger.log(`Application listening on port ${PORT}`, 'Bootstrap');
}
void bootstrap();
