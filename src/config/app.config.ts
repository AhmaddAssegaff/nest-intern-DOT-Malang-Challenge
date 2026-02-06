import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const CONFIG_NAME = 'app' as const;

const appConfig = registerAs(CONFIG_NAME, () => ({
  port: process.env.APP_PORT!,
  mode: process.env.NODE_ENV!,
  globalPrefix: process.env.API_PREFIX!,
  enableVersion: process.env.ENABLE_VERSION!,
  versionPrefix: process.env.VERSION_PREFIX!,
  defaultVersion: process.env.DEFAULT_VERSION!,
}));

type AppConfig = ReturnType<typeof appConfig>;
type AppKey = keyof AppConfig;

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

export const CONSTANTS_APP_KEYS: {
  APP: {
    [K in AppKey]: `${typeof CONFIG_NAME}.${K}`;
  };
} = {
  APP: {
    defaultVersion: 'app.defaultVersion',
    enableVersion: 'app.enableVersion',
    globalPrefix: 'app.globalPrefix',
    mode: 'app.mode',
    port: 'app.port',
    versionPrefix: 'app.versionPrefix',
  },
} as const;

export default appConfig;
