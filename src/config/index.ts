import { ConfigFactory } from '@nestjs/config';
import * as Joi from 'joi';

import * as app from './app.config';
import * as swg from './swagger.config';
import * as db from './database.config';
import * as jwt from './jwt.config';

export const configs = [
  app.appConfig,
  swg.swaggerConfig,
  db.databaseConfig,
  jwt.jwtConfig,
] satisfies ConfigFactory[];

export const validationSchema = Joi.object({
  ...app.appValidationSchema,
  ...swg.swaggerValidationSchema,
  ...db.databaseValidationSchema,
  ...jwt.jwtValidationSchema,
});

export interface ConfigSchema {
  [app.APP_CONFIG_NAME_KEY]: app.AppConfigI;
  [swg.SWAGGER_CONFIG_NAME_KEY]: swg.SwaggerConfigI;
  // [db.DATABASE_CONFIG_NAME_KEY]: db.DatabaseConfigI;
  [jwt.APP_CONFIG_NAME_KEY]: jwt.JwtConfigI;
}

export const CONSTANTS = {
  // ...app.CONSTANTS_APP_KEYS,
  ...db.CONSTANTS_DATABASE_KEYS,
  // ...jwt.CONSTANTS_JWT_KEYS,
} as const;

export default configs;
