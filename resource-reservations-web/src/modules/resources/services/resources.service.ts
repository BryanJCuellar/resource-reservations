import { api } from "../../../shared/api/api.config";
import type {
  Resource,
  ResourceForm,
  SearchResourcesBy,
  SearchResourcesResponse,
} from "../interfaces";
import { handleHttpException } from "../../../shared/utils";

export const createResource = async (form: ResourceForm): Promise<Resource> => {
  try {
    const { data } = await api.post<Resource>("/resources", form);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const searchResources = async (
  params: SearchResourcesBy,
): Promise<SearchResourcesResponse> => {
  try {
    const { data } = await api.get<SearchResourcesResponse>("/resources", {
      params,
    });
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const searchResourceById = async (id: string): Promise<Resource> => {
  try {
    const { data } = await api.get<Resource>(`/resources/${id}`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const editResource = async (
  id: string,
  form: ResourceForm,
): Promise<Resource> => {
  try {
    const { data } = await api.patch<Resource>(`/resources/${id}`, form);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const deactivateResource = async (id: string): Promise<Resource> => {
  try {
    const { data } = await api.delete<Resource>(`/resources/${id}`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const reactivateResource = async (id: string): Promise<Resource> => {
  try {
    const { data } = await api.patch<Resource>(`/resources/${id}/reactivate`);
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};
