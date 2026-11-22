import { useEffect, useState } from "react";
import type { Resource, ResourceForm, SearchResourcesBy } from "../interfaces";
import type { SelectOption } from "../../../shared/interfaces";
import {
  useCreateResourceMutation,
  useDeactivateResourceMutation,
  useEditResourceMutation,
  useReactivateResourceMutation,
  useResourcesQuery,
} from "./resources.query";
import { useResourceCategoriesQuery } from "../../resource-categories/hooks/resource-categories.query";
import { toast } from "sonner";
import { toErr } from "../../../shared/utils";

type ResourceModal =
  | { mode: "create" }
  | { mode: "edit"; resource: Resource }
  | { mode: "view"; resource: Resource }
  | { mode: "changeStatus"; resource: Resource }
  | null;

const searchResourcesByInit: SearchResourcesBy = {
  term: "",
  isActive: "true",
  resourceCategoryId: undefined,
  page: 1,
  limit: 10,
};

export const useResources = () => {
  const [term, setTerm] = useState<string>("");
  const [resourceModal, setResourceModal] = useState<ResourceModal>(null);
  const [searchResourcesBy, setSearchResourcesBy] = useState<SearchResourcesBy>(
    searchResourcesByInit,
  );

  const { page = 1, limit = 10 } = searchResourcesBy;

  const resourcesQuery = useResourcesQuery(searchResourcesBy);
  const categoriesQuery = useResourceCategoriesQuery({
    isActive: "true",
    limit: 9999,
  });

  const createMutation = useCreateResourceMutation();
  const editMutation = useEditResourceMutation();

  const deactivateMutation = useDeactivateResourceMutation();
  const reactivateMutation = useReactivateResourceMutation();

  const resources = resourcesQuery.data?.data ?? [];
  const totalItems = resourcesQuery.data?.count ?? 0;
  const categories = categoriesQuery.data?.data ?? [];
  const categoriesOpts: SelectOption[] = [
    { label: "Todas las categorías", value: "" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  const rangeStart = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, totalItems);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  /** Si el total disminuye y la página actual deja de existir,
   * vuelve a la última página válida cuando la consulta haya terminado. */
  if (
    resourcesQuery.isSuccess &&
    !resourcesQuery.isFetching &&
    resourcesQuery.data?.data !== undefined &&
    page > totalPages
  ) {
    setSearchResourcesBy((prev) => ({
      ...prev,
      page: totalPages,
    }));
  }

  const hasFilters =
    (searchResourcesBy.term ?? "").length > 0 ||
    searchResourcesBy.isActive !== undefined ||
    searchResourcesBy.resourceCategoryId !== undefined;

  const clearFilters = () => {
    setTerm("");
    setSearchResourcesBy((prev) => ({
      ...prev,
      term: "",
      isActive: undefined,
      resourceCategoryId: undefined,
      page: 1,
    }));
  };

  const changePage = (page: number) => {
    setSearchResourcesBy((prev) => ({
      ...prev,
      page: Math.max(1, (prev.page ?? 1) + page),
    }));
  };

  const handleSave = async (form: ResourceForm, id?: string) => {
    try {
      if (id) {
        const response = await editMutation.mutateAsync({ id, form });
        toast.dismiss();
        toast.success(`Recurso ${response.name} actualizado con éxito.`);
      } else {
        const response = await createMutation.mutateAsync(form);
        toast.dismiss();
        toast.success(`Recurso ${response.name} creado con éxito.`);
      }
      setResourceModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  const handleChangeStatus = async (resource: Resource) => {
    try {
      if (resource.isActive) {
        await deactivateMutation.mutateAsync(resource.id);
        toast.dismiss();
        toast.success(`Recurso ${resource.name} desactivado con éxito.`);
      } else {
        await reactivateMutation.mutateAsync(resource.id);
        toast.dismiss();
        toast.success(`Recurso ${resource.name} reactivado con éxito.`);
      }
      setResourceModal(null);
    } catch (error) {
      toast.error(toErr(error), { duration: 8000 });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchResourcesBy((prev) => ({ ...prev, term, page: 1 }));
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [term]);

  return {
    // Props
    term,
    setTerm,
    resourceModal,
    setResourceModal,
    searchResourcesBy,
    setSearchResourcesBy,
    page,
    limit,
    resources,
    totalItems,
    categories,
    categoriesOpts,
    isCategoriesPending: categoriesQuery.isPending,
    isCategoriesError: categoriesQuery.isError,
    refetchCategories: categoriesQuery.refetch,
    isPending: resourcesQuery.isPending,
    isError: resourcesQuery.isError,
    refetch: resourcesQuery.refetch,
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
