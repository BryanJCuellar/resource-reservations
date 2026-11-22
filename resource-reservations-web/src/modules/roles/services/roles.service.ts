import { api } from "../../../shared/api/api.config";
import type {
  Role,
  RoleForm,
  SearchRolesBy,
  SearchRolesResponse,
} from "../interfaces";
import { handleHttpException } from "../../../shared/utils";

export const createRole = async (form: RoleForm): Promise<Role> => {
  try {
    const { data } = await api.post<Role>("/roles", form);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const searchRoles = async (
  params: SearchRolesBy,
): Promise<SearchRolesResponse> => {
  try {
    const { data } = await api.get<SearchRolesResponse>("/roles", { params });
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const searchRoleById = async (id: string): Promise<Role> => {
  try {
    const { data } = await api.get<Role>(`/roles/${id}`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const editRole = async (id: string, form: RoleForm): Promise<Role> => {
  try {
    const { data } = await api.patch<Role>(`/roles/${id}`, form);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const deactivateRole = async (id: string): Promise<Role> => {
  try {
    const { data } = await api.delete<Role>(`/roles/${id}`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const reactivateRole = async (id: string): Promise<Role> => {
  try {
    const { data } = await api.patch<Role>(`/roles/${id}/reactivate`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};
