import { api } from "../../../shared/api/api.config";
import type {
  ResourceCategory,
  ResourceCategoryForm,
  SearchResourceCategoriesBy,
  SearchResourceCategoriesResponse,
} from "../interfaces";
import { handleHttpException } from "../../../shared/utils";

export const createResourceCategory = async (
  form: ResourceCategoryForm,
): Promise<ResourceCategory> => {
  try {
    const { data } = await api.post<ResourceCategory>(
      "/resource-categories",
      form,
    );
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const searchResourceCategories = async (
  params: SearchResourceCategoriesBy,
): Promise<SearchResourceCategoriesResponse> => {
  try {
    const { data } = await api.get<SearchResourceCategoriesResponse>(
      "/resource-categories",
      {
        params,
      },
    );
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const searchResourceCategoryById = async (
  id: string,
): Promise<ResourceCategory> => {
  try {
    const { data } = await api.get<ResourceCategory>(
      `/resource-categories/${id}`,
    );
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const editResourceCategory = async (
  id: string,
  form: ResourceCategoryForm,
): Promise<ResourceCategory> => {
  try {
    const { data } = await api.patch<ResourceCategory>(
      `/resource-categories/${id}`,
      form,
    );
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const deactivateResourceCategory = async (
  id: string,
): Promise<ResourceCategory> => {
  try {
    const { data } = await api.delete<ResourceCategory>(
      `/resource-categories/${id}`,
    );
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};

export const reactivateResourceCategory = async (
  id: string,
): Promise<ResourceCategory> => {
  try {
    const { data } = await api.patch<ResourceCategory>(
      `/resource-categories/${id}/reactivate`,
    );
    return data;
  } catch (error) {
    handleHttpException(error);
  }
};
