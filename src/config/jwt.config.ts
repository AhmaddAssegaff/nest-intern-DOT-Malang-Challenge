import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const JWT_CONFIG_NAME_KEY = 'jwt' as const;

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

export default registerAs<JwtConfigI>(JWT_CONFIG_NAME_KEY, () => ({
  AUTH_JWT_ACCESS_TOKEN_SECRET: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET!,
  AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: Number(
    process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN,
  ),
  AUTH_JWT_REFRESH_TOKEN_SECRET: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET!,
  AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: Number(
    process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN,
  ),
}));

type JwtKey = keyof JwtConfigI;

export const CONSTANTS_JWT_KEYS: {
  JWT: {
    [K in JwtKey]: `${typeof JWT_CONFIG_NAME_KEY}.${K}`;
  };
} = {
  JWT: {
    AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: 'jwt.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN',
    AUTH_JWT_ACCESS_TOKEN_SECRET: 'jwt.AUTH_JWT_ACCESS_TOKEN_SECRET',
    AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN: 'jwt.AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN',
    AUTH_JWT_REFRESH_TOKEN_SECRET: 'jwt.AUTH_JWT_REFRESH_TOKEN_SECRET',
  },
} as const;
