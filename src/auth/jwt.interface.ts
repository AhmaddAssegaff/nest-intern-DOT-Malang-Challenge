import { userRole } from '../user/user.interface';

export interface JwtPayload {
  sub: string;
  username: string;
  role: userRole;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
