import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const SWAGGER_CONFIG_NAME_KEY = 'swagger' as const;

export interface SwaggerConfigI {
  SWAGGER_DOCS_URL: string;
}

export const swaggerValidationSchema = {
  SWAGGER_DOCS_URL: Joi.string().required(),
};

export default registerAs<SwaggerConfigI>(
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

type JwtKey = keyof SwaggerConfigI;

export const CONSTANTS_SWAGGER_KEYS: {
  SWAGGER: {
    [K in JwtKey]: `${typeof SWAGGER_CONFIG_NAME_KEY}.${K}`;
  };
} = {
  SWAGGER: {
    SWAGGER_DOCS_URL: 'swagger.SWAGGER_DOCS_URL',
  },
} as const;
