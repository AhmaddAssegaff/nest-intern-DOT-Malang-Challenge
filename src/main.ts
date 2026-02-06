import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDocument } from './swagger/swagger';
import { CONSTANTS } from 'src/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const appMode = config.getOrThrow<string>(CONSTANTS.APP.mode);

  const port = config.getOrThrow<string>(CONSTANTS.APP.port);

  const defaultVersion = config.getOrThrow<string>(
    CONSTANTS.APP.defaultVersion,
  );
  const enableVersion = config.getOrThrow<string>(CONSTANTS.APP.enableVersion);

  const globalPrefix = config.getOrThrow<string>(CONSTANTS.APP.globalPrefix);
  const versionPrefix = config.getOrThrow<string>(CONSTANTS.APP.versionPrefix);

  app.setGlobalPrefix(globalPrefix);

  if (enableVersion) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion,
      prefix: versionPrefix,
    });
  }

  if (appMode === 'development') {
    createDocument(app);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);

  Logger.log(`Running in ${appMode} mode`, 'Bootstrap');
  Logger.log(`Application listening on port ${port}`, 'Bootstrap');
}
void bootstrap();
