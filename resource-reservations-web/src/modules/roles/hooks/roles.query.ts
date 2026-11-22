import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RoleForm, SearchRolesBy } from "../interfaces";
import {
  createRole,
  deactivateRole,
  editRole,
  reactivateRole,
  searchRoleById,
  searchRoles,
} from "../services/roles.service";

export const useRolesQuery = (params: SearchRolesBy) => {
  return useQuery({
    queryKey: ["roles", "find-all", params],
    queryFn: () => searchRoles(params),
    staleTime: 60_000,
  });
};

export const useRoleByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["roles", "find-by-id", id],
    queryFn: () => searchRoleById(id),
    staleTime: 60_000,
  });
};

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useEditRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: RoleForm }) =>
      editRole(id, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useDeactivateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useReactivateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateRole,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
