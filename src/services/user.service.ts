import { spentApi } from "@/api/spent.api";



export const LoginUser = async (email: string, password: string): Promise<any> => {
  try {
    const { data } = await spentApi.post('/User/Login', { email, password });
    return data;
  } catch (error) {
    throw new Error(`Error logging in user: ${error}`);
  }
}