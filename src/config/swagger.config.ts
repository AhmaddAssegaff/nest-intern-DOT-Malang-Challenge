import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const SWAGGER_CONFIG_NAME_KEY = 'swagger';

export interface SwaggerConfigI {
  SWAGGER_DOCS_URL: string;
}

export const swaggerValidationSchema = {
  SWAGGER_DOCS_URL: Joi.string().required(),
};

export const swaggerConfig = registerAs<SwaggerConfigI>(
  SWAGGER_CONFIG_NAME_KEY,
  (): SwaggerConfigI => ({
    SWAGGER_DOCS_URL: process.env.SWAGGER_DOCS_URL!,
  }),
);

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  tags: string[];
}

export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'Backend docs',
  description:
    'Dokumentasi ini di perlukan untuk kebutuhan demo intern-DOT-Malang-Challenge ',
  version: '1.0',
  tags: [],
};

export default swaggerConfig;
