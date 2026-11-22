import { useEffect, useState } from "react";
import type {
  EditUserForm,
  SearchUsersBy,
  UserData,
  UserForm,
} from "../interfaces";
import type { SelectOption } from "../../../shared/interfaces";
import {
  useCreateUserMutation,
  useDeactivateUserMutation,
  useEditUserMutation,
  useReactivateUserMutation,
  useUsersQuery,
} from "./users.query";
import { useRolesQuery } from "../../roles/hooks";
import { toast } from "sonner";
import { toErr } from "../../../shared/utils";

type userModal =
  | { mode: "create" }
  | { mode: "edit"; user: UserData }
  | { mode: "view"; user: UserData }
  | { mode: "changeStatus"; user: UserData }
  | null;

const searchUsersByInit: SearchUsersBy = {
  term: "",
  isActive: "true",
  roleId: undefined,
  page: 1,
  limit: 10,
};

export const useUsers = () => {
  const [term, setTerm] = useState<string>("");
  const [userModal, setUserModal] = useState<userModal>(null);
  const [searchUsersBy, setSearchUsersBy] =
    useState<SearchUsersBy>(searchUsersByInit);

  const { page = 1, limit = 10 } = searchUsersBy;

  const usersQuery = useUsersQuery(searchUsersBy);
  const rolesQuery = useRolesQuery({
    isActive: "true",
    limit: 9999,
  });

  const createMutation = useCreateUserMutation();
  const editMutation = useEditUserMutation();

  const deactivateMutation = useDeactivateUserMutation();
  const reactivateMutation = useReactivateUserMutation();

  const users = usersQuery.data?.data ?? [];
  const totalItems = usersQuery.data?.count ?? 0;

  const roles = rolesQuery.data?.data ?? [];

  const rolesOpts: SelectOption[] = [
    { label: "Todos los roles", value: "" },
    ...roles.map((role) => ({ label: role.name, value: role.id })),
  ];

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, totalItems);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  /** Si el total disminuye y la página actual deja de existir,
   * vuelve a la última página válida cuando la consulta haya terminado. */
  if (
    usersQuery.isSuccess &&
    !usersQuery.isFetching &&
    usersQuery.data?.data !== undefined &&
    page > totalPages
  ) {
    setSearchUsersBy((prev) => ({
      ...prev,
      page: totalPages,
    }));
  }

  const hasFilters =
    (searchUsersBy.term ?? "").trim().length > 0 ||
    searchUsersBy.isActive !== undefined ||
    searchUsersBy.roleId !== undefined;

  const clearFilters = () => {
    setTerm("");
    setSearchUsersBy((prev) => ({
      ...prev,
      term: "",
      isActive: undefined,
      roleId: undefined,
      page: 1,
    }));
  };

  const changePage = (page: number) => {
    setSearchUsersBy((prev) => ({
      ...prev,
      page: Math.max(1, (prev.page ?? 1) + page),
    }));
  };

  const handleCreate = async (form: UserForm) => {
    try {
      const response = await createMutation.mutateAsync(form);
      toast.dismiss();
      toast.success(`Usuario ${response.name} creado con éxito.`);
      setUserModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  const handleEdit = async (form: EditUserForm, id: string) => {
    try {
      const response = await editMutation.mutateAsync({ form, id });
      toast.dismiss();
      toast.success(`Usuario ${response.name} actualizado con éxito.`);
      setUserModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  const handleChangeStatus = async (user: UserData) => {
    try {
      if (user.isActive) {
        await deactivateMutation.mutateAsync(user.id);
        toast.dismiss();
        toast.success(`Usuario ${user.name} desactivado con éxito.`);
      } else {
        await reactivateMutation.mutateAsync(user.id);
        toast.dismiss();
        toast.success(`Usuario ${user.name} reactivado con éxito.`);
      }
      setUserModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchUsersBy((prev) => ({ ...prev, term, page: 1 }));
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [term]);

  return {
    // Props
    term,
    setTerm,
    userModal,
    setUserModal,
    searchUsersBy,
    setSearchUsersBy,
    page,
    limit,
    users,
    totalItems,
    roles,
    rolesOpts,
    isRolesPending: rolesQuery.isPending,
    isRolesError: rolesQuery.isError,
    refetchRoles: rolesQuery.refetch,
    isPending: usersQuery.isPending,
    isError: usersQuery.isError,
    refetch: usersQuery.refetch,
    isSaving: createMutation.isPending || editMutation.isPending,
    isChangingStatus:
      deactivateMutation.isPending || reactivateMutation.isPending,
    rangeStart,
    rangeEnd,
    totalPages,
    hasFilters,
    // Actions
    clearFilters,
    changePage,
    handleCreate,
    handleEdit,
    handleChangeStatus,
  };
};
