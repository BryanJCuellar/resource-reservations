import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ResourceForm, SearchResourcesBy } from "../interfaces";
import {
  createResource,
  deactivateResource,
  editResource,
  reactivateResource,
  searchResources,
  searchResourceById,
} from "../services/resources.service";

export const useResourcesQuery = (params: SearchResourcesBy) => {
  return useQuery({
    queryKey: ["resources", "find-all", params],
    queryFn: () => searchResources(params),
    staleTime: 60_000,
  });
};

export const useResourceByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["resources", "find-by-id", id],
    queryFn: () => searchResourceById(id),
    staleTime: 60_000,
  });
};

export const useCreateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResource,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resources"],
      });
    },
  });
};

export const useEditResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: ResourceForm }) =>
      editResource(id, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resources"],
      });
    },
  });
};

export const useDeactivateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateResource,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resources"],
      });
    },
  });
};

export const useReactivateResourceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateResource,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["resources"],
      });
    },
  });
};
