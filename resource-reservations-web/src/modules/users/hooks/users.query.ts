import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EditUserForm, SearchUsersBy } from "../interfaces";
import {
  createUser,
  deactivateUser,
  editUser,
  reactivateUser,
  searchUserById,
  searchUsers,
} from "../services/users.service";

export const useUsersQuery = (params: SearchUsersBy) => {
  return useQuery({
    queryKey: ["users", "find-all", params],
    queryFn: () => searchUsers(params),
    staleTime: 60_000,
  });
};

export const useUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["users", "find-by-id", id],
    queryFn: () => searchUserById(id),
    staleTime: 60_000,
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useEditUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: EditUserForm }) =>
      editUser(id, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeactivateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useReactivateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
