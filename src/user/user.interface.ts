export enum userRole {
  user = 'user',
  admin = 'admin',
}

export interface InterfaceUsers {
  id: string;
  username: string;
  password: string;
  role: userRole;
  created_at: Date;
}
