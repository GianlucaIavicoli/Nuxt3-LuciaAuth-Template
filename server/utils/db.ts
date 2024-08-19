export interface DatabaseUser {
  id: string;
  avatarUrl: string | null;
  displayName: string | null;
  username: string;
  email: string | null;
  emailVerified: string | null;
  password: string | null;
  role: Roles[];
  createdAt: Date;
  updatedAt: Date | null;
  session: DatabaseSession[];
  passwordResetToken: DatabasePasswordResetToken[];
  github: number | null;
  google: string | null;
}

export interface DatabaseSession {
  id: string;
  userId: string;
  expiresAt: Date;
  user: DatabaseUser;
}

export interface DatabasePasswordResetToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  user: DatabaseUser;
}

export interface Roles {
  admin: string;
  user: string;
}
