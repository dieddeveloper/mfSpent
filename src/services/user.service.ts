import { spentApi } from "@/api/spent.api";
import {
  AuthUser,
  LoginCredentials,
  LoginResult,
  RegisterCredentials,
  SpentResponse,
} from "@/models/spentResponse.model";

interface LoginResponseData {
  token?: string;
  accessToken?: string;
  user?: AuthUser;
  usuario?: AuthUser;
}

const getLoginResult = (response: SpentResponse<LoginResponseData>): LoginResult => {
  const token = response.data?.token ?? response.data?.accessToken;

  if (!token) {
    throw new Error(response.message || "The login response did not include an authentication token.");
  }

  return { token };
};

export async function LoginUser(
  credentials: LoginCredentials
): Promise<SpentResponse<LoginResult>>;
export async function LoginUser(
  email: string,
  password: string
): Promise<SpentResponse<LoginResult>>;
export async function LoginUser(
  credentialsOrEmail: LoginCredentials | string,
  password?: string
): Promise<SpentResponse<LoginResult>> {
  const credentials =
    typeof credentialsOrEmail === "string"
      ? { email: credentialsOrEmail, password: password ?? "" }
      : credentialsOrEmail;

  try {
    const { data } = await spentApi.post<SpentResponse<LoginResponseData>>('/User/Login', credentials);
    return {
      ...data,
      data: getLoginResult(data),
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error logging in user.");
  }
}

export async function RegisterUser(
  credentials: RegisterCredentials
): Promise<SpentResponse<AuthUser>>;
export async function RegisterUser(
  email: string,
  password: string
): Promise<SpentResponse<AuthUser>>;
export async function RegisterUser(
  credentialsOrEmail: RegisterCredentials | string,
  password?: string
): Promise<SpentResponse<AuthUser>> {
  const credentials =
    typeof credentialsOrEmail === "string"
      ? { email: credentialsOrEmail, password: password ?? "" }
      : credentialsOrEmail;

  try {
    const { data } = await spentApi.post<SpentResponse<AuthUser>>('/User/Register', credentials);
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error registering user.");
  }
}

export const CheckSession = async (token: string): Promise<SpentResponse<AuthUser>> => {
  try {
    const { data } = await spentApi.post<SpentResponse<AuthUser>>(
      '/User/CheckStatus',
      JSON.stringify(token),
      { headers: { 'Content-Type': 'application/json' } }
    );
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error checking session.");
  }
};

export const GetCurrentUser = async (): Promise<AuthUser | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await CheckSession(token);
  if (!response.success || !response.data?.id) {
    localStorage.removeItem("token");
    return null;
  }

  return response.data;
};