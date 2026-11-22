import { api } from "../../../shared/api/api.config";
import type {
    EditUserForm,
  SearchUsersBy,
  SearchUsersResponse,
  UserData,
  UserForm,
} from "../interfaces";
import { handleHttpException } from "../../../shared/utils";

export const createUser = async (form: UserForm): Promise<UserData> => {
  try {
    const { data } = await api.post<UserData>("/users", form);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const searchUsers = async (
  params: SearchUsersBy,
): Promise<SearchUsersResponse> => {
  try {
    const { data } = await api.get<SearchUsersResponse>("/users", { params });
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const searchUserById = async (id: string): Promise<UserData> => {
  try {
    const { data } = await api.get<UserData>(`/users/${id}`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const editUser = async (
  id: string,
  form: EditUserForm,
): Promise<UserData> => {
  try {
    const { data } = await api.patch<UserData>(`/users/${id}`, form);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const deactivateUser = async (id: string): Promise<UserData> => {
  try {
    const { data } = await api.delete<UserData>(`/users/${id}`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const reactivateUser = async (id: string): Promise<UserData> => {
  try {
    const { data } = await api.patch<UserData>(`/users/${id}/reactivate`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};
