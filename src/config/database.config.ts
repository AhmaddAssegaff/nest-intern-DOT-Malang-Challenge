import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const DATABASE_CONFIG_NAME_KEY = 'database' as const;

export interface DatabaseConfigI {
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
}

export const databaseValidationSchema = {
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().required(),
};

export const databaseConfig = registerAs<DatabaseConfigI>(
  DATABASE_CONFIG_NAME_KEY,
  () => ({
    DB_NAME: process.env.DB_NAME!,
    DB_USER: process.env.DB_USER!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: Number(process.env.DB_PORT),
  }),
);

export default databaseConfig;
