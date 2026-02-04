import { userRole } from '../user/user.interface';

export interface JwtPayload {
  sub: string;
  username: string;
  role: userRole;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  payload: JwtPayload;
  tokens: AuthTokens;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface ReqisterRequestDto {
  username: string;
  password: string;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
