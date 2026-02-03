import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SWAGGER_CONFIG } from '../config/swagger.config';
import { ConfigSchema } from '../config/index';

export function createDocument(app: INestApplication) {
  const configService = app.get(ConfigService<ConfigSchema>);
  const SWAGGER_PATH = configService.getOrThrow('swagger.SWAGGER_DOCS_URL', {
    infer: true,
  });

  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    );
  SWAGGER_CONFIG.tags.forEach((tag) => {
    builder.addTag(tag);
  });

  const options = builder.build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      deepScanRoutes: true,
      showRequestDuration: true,
    },
  });
}
