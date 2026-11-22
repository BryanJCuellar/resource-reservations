import { useEffect, useState } from "react";
import type { Role, RoleForm, SearchRolesBy } from "../interfaces";
import {
  useCreateRoleMutation,
  useDeactivateRoleMutation,
  useEditRoleMutation,
  useReactivateRoleMutation,
  useRolesQuery,
} from "./roles.query";
import { toast } from "sonner";
import { toErr } from "../../../shared/utils";

type RoleModal =
  | { mode: "create" }
  | { mode: "edit"; role: Role }
  | { mode: "view"; role: Role }
  | { mode: "changeStatus"; role: Role }
  | null;

const searchRolesByInit: SearchRolesBy = {
  term: "",
  isActive: "true",
  page: 1,
  limit: 10,
};

export const useRoles = () => {
  const [term, setTerm] = useState<string>("");
  const [roleModal, setRoleModal] = useState<RoleModal>(null);
  const [searchRolesBy, setSearchRolesBy] =
    useState<SearchRolesBy>(searchRolesByInit);

  const { page = 1, limit = 10 } = searchRolesBy;

  const rolesQuery = useRolesQuery(searchRolesBy);

  const createMutation = useCreateRoleMutation();
  const editMutation = useEditRoleMutation();
  const deactivateMutation = useDeactivateRoleMutation();
  const reactivateMutation = useReactivateRoleMutation();

  const roles = rolesQuery.data?.data ?? [];
  const totalItems = rolesQuery.data?.count ?? 0;

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, totalItems);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  /** Si el total disminuye y la página actual deja de existir,
   * vuelve a la última página válida cuando la consulta haya terminado. */
  if (
    rolesQuery.isSuccess &&
    !rolesQuery.isFetching &&
    rolesQuery.data?.data !== undefined &&
    page > totalPages
  ) {
    setSearchRolesBy((prev) => ({
      ...prev,
      page: totalPages,
    }));
  }

  const hasFilters =
    (searchRolesBy.term ?? "").length > 0 ||
    searchRolesBy.isActive !== undefined;

  const clearFilters = () => {
    setTerm("");
    setSearchRolesBy((prev) => ({
      ...prev,
      term: "",
      isActive: undefined,
      page: 1,
    }));
  };

  const changePage = (page: number) => {
    setSearchRolesBy((prev) => ({
      ...prev,
      page: Math.max(1, (prev.page ?? 1) + page),
    }));
  };

  const handleSave = async (form: RoleForm, id?: string) => {
    try {
      if (id) {
        const response = await editMutation.mutateAsync({ id, form });
        toast.dismiss();
        toast.success(`Rol ${response.name} actualizado con éxito.`);
      } else {
        const response = await createMutation.mutateAsync(form);
        toast.dismiss();
        toast.success(`Rol ${response.name} creado con éxito.`);
      }
      setRoleModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  const handleChangeStatus = async (role: Role) => {
    try {
      if (role.isActive) {
        await deactivateMutation.mutateAsync(role.id);
        toast.dismiss();
        toast.success(`Rol ${role.name} desactivado con éxito.`);
      } else {
        await reactivateMutation.mutateAsync(role.id);
        toast.dismiss();
        toast.success(`Rol ${role.name} reactivado con éxito.`);
      }
      setRoleModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchRolesBy((prev) => ({ ...prev, term, page: 1 }));
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [term]);

  return {
    // Props
    term,
    setTerm,
    roleModal,
    setRoleModal,
    searchRolesBy,
    setSearchRolesBy,
    page,
    limit,
    roles,
    totalItems,
    isPending: rolesQuery.isPending,
    isError: rolesQuery.isError,
    refetch: rolesQuery.refetch,
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
    handleSave,
    handleChangeStatus,
  };
};
