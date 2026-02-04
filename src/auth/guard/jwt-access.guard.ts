import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_ACCESS_TOKEN_STRATEGY } from '../constant';

@Injectable()
export class JwtAccessGuard extends AuthGuard(JWT_ACCESS_TOKEN_STRATEGY) {}
