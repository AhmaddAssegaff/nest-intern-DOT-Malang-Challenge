import { userRole } from '../user/user.interface';
import { Request } from 'express';

/**
 * Isi token JWT (signed)
 */
export interface JwtAuthPayload {
  sub: string;
  role: userRole;
  iat?: number;
  exp?: number;
}

/**
 * User context hasil authentication
 * (request.user)
 */
export interface AuthenticatedUser {
  sub: string;
  role: userRole;
}

/**
 * Pasangan token
 */
export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Response auth ke client
 */
export interface AuthResponseDto {
  tokens: AuthTokenPair;
}

/**
 * Request yang sudah terautentikasi
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
