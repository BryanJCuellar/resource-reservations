import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ResourceCategoryForm,
  SearchResourceCategoriesBy,
} from "../interfaces";
import {
  createResourceCategory,
  deactivateResourceCategory,
  editResourceCategory,
  reactivateResourceCategory,
  searchResourceCategories,
  searchResourceCategoryById,
} from "../services/resource-categories.service";

export const useResourceCategoriesQuery = (
  params: SearchResourceCategoriesBy,
) => {
  return useQuery({
    queryKey: ["resource-categories", "find-all", params],
    queryFn: () => searchResourceCategories(params),
    staleTime: 60_000,
  });
};

export const useResourceCategoryByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["resource-categories", "find-by-id", id],
    queryFn: () => searchResourceCategoryById(id),
    staleTime: 60_000,
  });
};

export const useCreateResourceCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResourceCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resource-categories"],
      });
    },
  });
};

export const useEditResourceCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: ResourceCategoryForm }) =>
      editResourceCategory(id, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resource-categories"],
      });
    },
  });
};

export const useDeactivateResourceCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateResourceCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resource-categories"],
      });
    },
  });
};

export const useReactivateResourceCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateResourceCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resource-categories"],
      });
    },
  });
};
