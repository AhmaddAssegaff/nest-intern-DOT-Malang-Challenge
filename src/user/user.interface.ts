export enum userRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserResponese {
  id: string;
  username: string;
  password: string;
  role: userRole;
  created_at: Date;
}

export interface UserProfileResponese {
  id: string;
  username: string;
  role: string;
  created_at: Date;
}
