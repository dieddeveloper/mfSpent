import { NoveltyType } from "./spentForm.model";

export interface SpentResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  error?: string;
  success: boolean;
}

export interface AuthUser {
  id?: string;
  userId?: number;
  email: string;
  name?: string;
  roleId?: number;
  documentNumber?: string;
}

export type CurrentUser = AuthUser & { id: string };

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

export interface CreateNoveltyBody {
  name: string;
  value: number;
  description: string;
  noveltyType: NoveltyType;
  top: number;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  paymentInstallments: number;
  userID: number;
  links: string;
}

export enum UserRole {
  Admin = 1,
  User = 2,
}