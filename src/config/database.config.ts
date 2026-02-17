import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const CONFIG_NAME = 'database' as const;

export const databaseConfig = registerAs(CONFIG_NAME, () => ({
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
}));

type DatabaseConfig = ReturnType<typeof databaseConfig>;
type DatabaseKey = keyof DatabaseConfig;

export const databaseValidationSchema = {
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().required(),
};

export const CONSTANTS_DATABASE_KEYS: {
  DATABASE: {
    [K in DatabaseKey]: `${typeof CONFIG_NAME}.${K}`;
  };
} = {
  DATABASE: {
    DB_NAME: 'database.DB_NAME',
    DB_USER: 'database.DB_USER',
    DB_PASSWORD: 'database.DB_PASSWORD',
    DB_HOST: 'database.DB_HOST',
    DB_PORT: 'database.DB_PORT',
  },
} as const;

export default databaseConfig;
