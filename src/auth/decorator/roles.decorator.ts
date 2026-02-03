import { SetMetadata } from '@nestjs/common';
import { userRole } from '../../user/user.interface';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: userRole[]) => SetMetadata(ROLES_KEY, roles);
