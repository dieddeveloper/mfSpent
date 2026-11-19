export interface SpentResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  error?: string;
  success: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roleId?: number;
  documentNumber?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export interface RegisterUserData extends LoginCredentials {
  name: string;
  roleId: number;
  documentNumber: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
  roleId?: UserRole;
  documentNumber?: string;
}

export enum UserRole {
  Admin = 1,
  User = 2,
}