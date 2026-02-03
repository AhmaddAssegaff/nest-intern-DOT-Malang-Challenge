import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const APP_CONFIG_NAME_KEY = 'app';

export interface AppConfigI {
  port: number;
  mode: 'development' | 'staging' | 'production';
  globalPrefix: string;
  enableVersion: boolean;
  versionPrefix: string;
  defaultVersion: string;
}

export const appValidationSchema = {
  APP_PORT: Joi.number().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .required(),
  API_PREFIX: Joi.string().required(),
  ENABLE_VERSION: Joi.boolean().required(),
  VERSION_PREFIX: Joi.string().required(),
  DEFAULT_VERSION: Joi.string().required(),
};

export const appConfig = registerAs<AppConfigI>(
  APP_CONFIG_NAME_KEY,
  (): AppConfigI => ({
    port: Number(process.env.APP_PORT),
    mode: process.env.NODE_ENV as AppConfigI['mode'],
    globalPrefix: process.env.API_PREFIX!,
    enableVersion: process.env.ENABLE_VERSION === 'true',
    versionPrefix: process.env.VERSION_PREFIX!,
    defaultVersion: process.env.DEFAULT_VERSION!,
  }),
);

export default appConfig;
