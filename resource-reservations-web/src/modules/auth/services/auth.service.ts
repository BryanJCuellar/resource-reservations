import { isAxiosError } from "axios";
import { api } from "../../../shared/api/api.config";

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post<{ accessToken: string }>("/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message, { cause: error });
    }
    throw error;
  }
};
