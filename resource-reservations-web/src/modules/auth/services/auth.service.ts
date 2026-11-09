import { api } from "../../../shared/api/api.config";
import { handleHttpException } from "../../../shared/utils";
import type {
  AuthenticatedUser,
  LoginResponse,
  RegisterUserForm,
} from "../interfaces";
import type { UserData } from "../../users/interfaces";

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const getAuthUser = async (): Promise<AuthenticatedUser> => {
  const { data } = await api.get<AuthenticatedUser>("/auth/user");
  return data;
};

export const registerUser = async (
  form: RegisterUserForm,
): Promise<UserData> => {
  try {
    const { data } = await api.post<UserData>("/users/register", form);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};
