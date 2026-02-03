import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const APP_CONFIG_NAME_KEY = 'jwt';

export interface JwtConfigI {
  AUTH_JWT_ACCESS_TOKEN_SECRET: string;
  AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: number;
  AUTH_JWT_REFRESH_TOKEN_SECRET: string;
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: number;
}

export const jwtValidationSchema = {
  AUTH_JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
  AUTH_JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
};

export const jwtConfig = registerAs<JwtConfigI>(APP_CONFIG_NAME_KEY, () => ({
  AUTH_JWT_ACCESS_TOKEN_SECRET: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET!,
  AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: Number(
    process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
  ),
  AUTH_JWT_REFRESH_TOKEN_SECRET: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET!,
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: Number(
    process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
  ),
}));
export default jwtConfig;
