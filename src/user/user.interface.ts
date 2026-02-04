export enum userRole {
  user = 'user',
  admin = 'admin',
}

export interface userResponese {
  id: string;
  username: string;
  password: string;
  role: userRole;
  created_at: Date;
}

export interface userProfileResponese {
  id: string;
  username: string;
  role: string;
  created_at: Date;
}
