import { useEffect, useState } from "react";
import type {
  ResourceCategory,
  ResourceCategoryForm,
  SearchResourceCategoriesBy,
} from "../interfaces";
import {
  useCreateResourceCategoryMutation,
  useDeactivateResourceCategoryMutation,
  useEditResourceCategoryMutation,
  useReactivateResourceCategoryMutation,
  useResourceCategoriesQuery,
} from "./resource-categories.query";
import { toast } from "sonner";
import { toErr } from "../../../shared/utils";

type ResourceCategoryModal =
  | { mode: "create" }
  | { mode: "edit"; category: ResourceCategory }
  | { mode: "view"; category: ResourceCategory }
  | { mode: "changeStatus"; category: ResourceCategory }
  | null;

const searchResourceCategoriesByInit: SearchResourceCategoriesBy = {
  term: "",
  isActive: "true",
  page: 1,
  limit: 10,
};

export const useResourceCategories = () => {
  const [term, setTerm] = useState<string>("");
  const [categoryModal, setCategoryModal] =
    useState<ResourceCategoryModal>(null);
  const [searchResourceCategoriesBy, setSearchResourceCategoriesBy] =
    useState<SearchResourceCategoriesBy>(searchResourceCategoriesByInit);

  const { page = 1, limit = 10 } = searchResourceCategoriesBy;

  const resourceCategoriesQuery = useResourceCategoriesQuery(
    searchResourceCategoriesBy,
  );

  const createMutation = useCreateResourceCategoryMutation();
  const editMutation = useEditResourceCategoryMutation();

  const deactivateMutation = useDeactivateResourceCategoryMutation();
  const reactivateMutation = useReactivateResourceCategoryMutation();

  const resourceCategories = resourceCategoriesQuery.data?.data;
  const totalItems = resourceCategoriesQuery.data?.count ?? 0;

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, totalItems);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  /** Si el total disminuye y la página actual deja de existir,
   * vuelve a la última página válida cuando la consulta haya terminado. */
  if (
    resourceCategoriesQuery.isSuccess &&
    !resourceCategoriesQuery.isFetching &&
    resourceCategoriesQuery.data?.data !== undefined &&
    page > totalPages
  ) {
    setSearchResourceCategoriesBy((prev) => ({
      ...prev,
      page: totalPages,
    }));
  }

  const hasFilters =
    (searchResourceCategoriesBy.term ?? "").length > 0 ||
    searchResourceCategoriesBy.isActive !== undefined;

  const clearFilters = () => {
    setTerm("");
    setSearchResourceCategoriesBy((prev) => ({
      ...prev,
      term: "",
      isActive: undefined,
      page: 1,
    }));
  };

  const changePage = (page: number) => {
    setSearchResourceCategoriesBy((prev) => ({
      ...prev,
      page: Math.max(1, (prev.page ?? 1) + page),
    }));
  };

  const handleSave = async (form: ResourceCategoryForm, id?: string) => {
    try {
      if (id) {
        const response = await editMutation.mutateAsync({ id, form });
        toast.dismiss();
        toast.success(`Categoría ${response.name} actualizada con éxito.`);
      } else {
        const response = await createMutation.mutateAsync(form);
        toast.dismiss();
        toast.success(`Categoría ${response.name} creada con éxito.`);
      }
      setCategoryModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  const handleChangeStatus = async (category: ResourceCategory) => {
    try {
      if (category.isActive) {
        await deactivateMutation.mutateAsync(category.id);
        toast.dismiss();
        toast.success(`Categoría ${category.name} desactivada con éxito.`);
      } else {
        await reactivateMutation.mutateAsync(category.id);
        toast.dismiss();
        toast.success(`Categoría ${category.name} reactivada con éxito.`);
      }
      setCategoryModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchResourceCategoriesBy((prev) => ({ ...prev, term, page: 1 }));
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [term]);

  return {
    // Props
    term,
    setTerm,
    categoryModal,
    setCategoryModal,
    searchResourceCategoriesBy,
    setSearchResourceCategoriesBy,
    page,
    limit,
    resourceCategories,
    totalItems,
    isPending: resourceCategoriesQuery.isPending,
    isError: resourceCategoriesQuery.isError,
    refetch: resourceCategoriesQuery.refetch,
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
