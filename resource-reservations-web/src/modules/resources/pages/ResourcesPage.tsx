import {
  Archive,
  ArchiveRestore,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { FilterSelect } from "../../../components/ui/FilterSelect";
import { IconButton } from "../../../components/ui/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { TextField } from "../../../components/ui/TextField";
import {
  ACTIVE_STATUS_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from "../../../shared/consts";
import { ResourceFormModal } from "../components/ResourceFormModal";
import { ResourceViewModal } from "../components/ResourceViewModal";
import { useResources } from "../hooks";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";

export const ResourcesPage = () => {
  const {
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
    isCategoriesPending,
    isCategoriesError,
    refetchCategories,
    isPending,
    isError,
    refetch,
    isSaving,
    isChangingStatus,
    rangeStart,
    rangeEnd,
    totalPages,
    hasFilters,
    clearFilters,
    changePage,
    handleSave,
    handleChangeStatus,
  } = useResources();

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-blue-950 dark:text-slate-100">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Recursos
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Administra los recursos que se pueden reservar.
            </p>
          </div>
          <Button
            type="button"
            variant="contained"
            disableElevation
            onClick={() => setResourceModal({ mode: "create" })}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nuevo recurso
          </Button>
        </header>

        <search
          aria-label="Filtros de recursos"
          className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_auto] lg:items-end"
        >
          <div className="min-w-0 flex-1">
            <TextField
              id="resource-search"
              label="Buscar recurso"
              fullWidth
              size="small"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Nombre o código…"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        className="size-4 text-slate-500 dark:text-slate-400"
                        aria-hidden="true"
                      />
                    </InputAdornment>
                  ),
                  endAdornment: term ? (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        aria-label="Vaciar búsqueda"
                        onClick={() => setTerm("")}
                        edge="end"
                      >
                        <X aria-hidden="true" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                },
                htmlInput: {
                  className:
                    "placeholder:text-slate-500 placeholder:opacity-100 dark:placeholder:text-slate-400",
                },
              }}
            />
          </div>

          <div className="min-w-0">
            <label
              id="resource-category-label"
              className="mb-2 block text-sm font-medium"
            >
              Categoría
            </label>
            <FilterSelect
              id="resource-category"
              labelId="resource-category-label"
              value={searchResourcesBy.resourceCategoryId ?? ""}
              options={categoriesOpts}
              onChange={(value) => {
                setSearchResourcesBy((prev) => ({
                  ...prev,
                  resourceCategoryId: value || undefined,
                  page: 1,
                }));
              }}
              className="w-full min-w-0"
            />
            {isCategoriesPending && (
              <p
                role="status"
                className="mt-1 text-xs text-slate-600 dark:text-slate-300"
              >
                Cargando categorías…
              </p>
            )}
            {isCategoriesError && (
              <div
                role="alert"
                className="mt-1 text-xs text-red-600 dark:text-red-300"
              >
                <p>No se pudieron cargar las categorías.</p>
                <Button
                  type="button"
                  size="small"
                  onClick={() => refetchCategories()}
                >
                  Reintentar
                </Button>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <label
              id="resource-status-label"
              className="mb-2 block text-sm font-medium"
            >
              Estado
            </label>
            <FilterSelect
              id="resource-status"
              labelId="resource-status-label"
              value={searchResourcesBy.isActive ?? ""}
              options={ACTIVE_STATUS_OPTIONS}
              onChange={(value) => {
                setSearchResourcesBy((prev) => ({
                  ...prev,
                  isActive:
                    value === "" ? undefined : (value as "true" | "false"),
                  page: 1,
                }));
              }}
              className="w-full"
            />
          </div>

          <Button
            type="button"
            size="small"
            disabled={!hasFilters}
            onClick={clearFilters}
            className="w-full lg:w-auto lg:justify-self-end"
          >
            Limpiar filtros
          </Button>
        </search>

        <div
          aria-busy={isPending}
          className="@container overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
        >
          {isError ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
              <CircleAlert
                className="size-8 text-rose-600 dark:text-rose-400"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-semibold">
                  No se pudieron cargar los recursos
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Intenta cargar la información nuevamente.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => refetch()}
                variant="outlined"
              >
                Reintentar
              </Button>
            </div>
          ) : isPending ? (
            <>
              <span role="status" className="sr-only">
                Cargando recursos
              </span>
              <SkeletonRows />
            </>
          ) : (
            <>
              {/* Desktop Table */}
              <div
                className="scrollbar-custom hidden overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:block dark:focus-visible:outline-blue-300"
                tabIndex={0}
                role="region"
                aria-label="Tabla de recursos"
              >
                <table className="w-full min-w-180 table-fixed text-sm">
                  <caption className="sr-only">Recursos</caption>
                  <colgroup>
                    <col className="w-[23%]" />
                    <col />
                    <col className="w-32" />
                    <col className="w-40" />
                  </colgroup>
                  <thead className="bg-slate-100 dark:bg-slate-900/60">
                    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-transparent">
                      {["Nombre", "Categoría", "Estado", "Acciones"].map(
                        (label) => (
                          <th
                            key={label}
                            scope="col"
                            className={`px-5 py-3 align-middle text-xs font-semibold text-slate-600 dark:text-slate-300 ${label === "Acciones" ? "text-right" : "text-left"}`}
                          >
                            {label}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {resources.map((resource) => (
                      <tr
                        key={resource.id}
                        className="border-b border-slate-100 dark:border-slate-700/80"
                      >
                        <td className="align-middle px-5 py-4 font-medium text-blue-950 wrap-anywhere dark:text-slate-100">
                          {resource.name}
                          <span className="mt-1 block text-xs font-normal text-slate-600 dark:text-slate-300">
                            {resource.code}
                          </span>
                        </td>
                        <td className="align-middle min-w-0 px-5 py-4">
                          <p className="line-clamp-2 whitespace-normal text-sm leading-5 text-slate-600 wrap-anywhere dark:text-slate-300">
                            {resource.resourceCategory?.name || (
                              <span className="italic text-slate-400">—</span>
                            )}
                          </p>
                        </td>
                        <td className="align-middle px-5 py-4">
                          <StatusBadge
                            active={resource.isActive}
                            label={resource.isActive ? "Activo" : "Inactivo"}
                          />
                        </td>
                        <td className="align-middle px-4 py-3">
                          <div className="flex justify-end">
                            <IconButton
                              type="button"
                              aria-label={`Ver recurso ${resource.name}`}
                              tooltip="Ver recurso"
                              onClick={() =>
                                setResourceModal({ mode: "view", resource })
                              }
                            >
                              <Eye aria-hidden="true" />
                            </IconButton>
                            <IconButton
                              type="button"
                              aria-label={`Editar recurso ${resource.name}`}
                              disabled={!resource.isActive}
                              tooltip={
                                resource.isActive
                                  ? "Editar recurso"
                                  : "Reactiva el recurso para editarlo"
                              }
                              onClick={() =>
                                setResourceModal({ mode: "edit", resource })
                              }
                            >
                              <Pencil aria-hidden="true" />
                            </IconButton>
                            <IconButton
                              type="button"
                              aria-label={
                                resource.isActive
                                  ? `Desactivar recurso ${resource.name}`
                                  : `Reactivar recurso ${resource.name}`
                              }
                              tooltip={
                                resource.isActive
                                  ? "Desactivar recurso"
                                  : "Reactivar recurso"
                              }
                              onClick={() =>
                                setResourceModal({
                                  mode: "changeStatus",
                                  resource,
                                })
                              }
                            >
                              {resource.isActive ? (
                                <Archive aria-hidden="true" />
                              ) : (
                                <ArchiveRestore aria-hidden="true" />
                              )}
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-700">
                {resources.map((resource) => (
                  <article key={resource.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 wrap-anywhere font-medium text-blue-950 dark:text-slate-100">
                        {resource.name}
                        <span className="mt-1 block text-xs font-normal text-slate-600 dark:text-slate-300">
                          {resource.code}
                        </span>
                      </h2>
                      <StatusBadge
                        active={resource.isActive}
                        label={resource.isActive ? "Activo" : "Inactivo"}
                        showDot={false}
                      />
                    </div>
                    <p className="line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                      {resource.resourceCategory?.name || (
                        <span className="italic text-slate-400">—</span>
                      )}
                    </p>
                    <div className="flex justify-end border-t border-slate-100 pt-2 dark:border-slate-700">
                      <IconButton
                        type="button"
                        aria-label={`Ver recurso ${resource.name}`}
                        tooltip="Ver recurso"
                        onClick={() =>
                          setResourceModal({ mode: "view", resource })
                        }
                      >
                        <Eye aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        type="button"
                        aria-label={`Editar recurso ${resource.name}`}
                        disabled={!resource.isActive}
                        tooltip={
                          resource.isActive
                            ? "Editar recurso"
                            : "Reactiva el recurso para editarlo"
                        }
                        onClick={() =>
                          setResourceModal({ mode: "edit", resource })
                        }
                      >
                        <Pencil aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        type="button"
                        aria-label={
                          resource.isActive
                            ? `Desactivar recurso ${resource.name}`
                            : `Reactivar recurso ${resource.name}`
                        }
                        tooltip={
                          resource.isActive
                            ? "Desactivar recurso"
                            : "Reactivar recurso"
                        }
                        onClick={() =>
                          setResourceModal({ mode: "changeStatus", resource })
                        }
                      >
                        {resource.isActive ? (
                          <Archive aria-hidden="true" />
                        ) : (
                          <ArchiveRestore aria-hidden="true" />
                        )}
                      </IconButton>
                    </div>
                  </article>
                ))}
              </div>

              {totalItems === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    {hasFilters ? (
                      <Search aria-hidden="true" />
                    ) : (
                      <Archive aria-hidden="true" />
                    )}
                  </div>
                  <h2 className="font-semibold">
                    {hasFilters
                      ? "No encontramos recursos"
                      : "Todavía no hay recursos"}
                  </h2>
                  <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-300">
                    {hasFilters
                      ? "Prueba con otra búsqueda o cambia los filtros."
                      : "Crea un recurso para comenzar."}
                  </p>
                  {hasFilters ? (
                    <Button
                      type="button"
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      Limpiar filtros
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setResourceModal({ mode: "create" })}
                      variant="contained"
                      disableElevation
                      className="mt-4 [&_svg]:size-4"
                    >
                      <Plus aria-hidden="true" /> Nuevo recurso
                    </Button>
                  )}
                </div>
              )}

              {resources.length > 0 && (
                <footer className="grid grid-cols-1 items-center gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 @[480px]:grid-cols-2 @[720px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] dark:border-slate-700 dark:text-slate-300">
                  <p className="text-center @[480px]:col-start-1 @[480px]:row-start-1 @[480px]:justify-self-start @[480px]:text-left @[720px]:col-start-1 @[720px]:row-start-1">
                    {rangeStart}–{rangeEnd} de {totalItems}{" "}
                    {totalItems === 1 ? "recurso" : "recursos"}
                  </p>
                  <nav
                    aria-label="Paginación de recursos"
                    className="flex items-center justify-center gap-1 @[480px]:col-span-2 @[480px]:col-start-1 @[480px]:row-start-2 @[480px]:justify-self-center @[720px]:col-span-1 @[720px]:col-start-2 @[720px]:row-start-1"
                  >
                    <IconButton
                      type="button"
                      aria-label="Página anterior"
                      disabled={page <= 1}
                      onClick={() => changePage(-1)}
                      className="border border-slate-300 dark:border-slate-600"
                    >
                      <ChevronLeft />
                    </IconButton>
                    <span
                      aria-live="polite"
                      className="min-w-20 text-center text-sm text-blue-950 dark:text-slate-100"
                    >
                      {page} de {totalPages}
                    </span>
                    <IconButton
                      type="button"
                      aria-label="Página siguiente"
                      disabled={page >= totalPages}
                      onClick={() => changePage(1)}
                      className="border border-slate-300 dark:border-slate-600"
                    >
                      <ChevronRight />
                    </IconButton>
                  </nav>
                  <div className="flex min-w-0 items-center justify-center gap-2 @[480px]:col-start-2 @[480px]:row-start-1 @[480px]:justify-self-end @[720px]:col-start-3 @[720px]:row-start-1">
                    <label id="page-size-label" className="whitespace-nowrap">
                      Filas por página
                    </label>
                    <FilterSelect
                      id="page-size"
                      labelId="page-size-label"
                      value={limit}
                      options={PAGE_SIZE_OPTIONS.map((value) => ({
                        label: String(value),
                        value,
                      }))}
                      onChange={(value) => {
                        setSearchResourcesBy((prev) => ({
                          ...prev,
                          limit: value,
                          page: 1,
                        }));
                      }}
                      size="small"
                      className="w-20"
                    />
                  </div>
                </footer>
              )}
            </>
          )}
        </div>
      </section>
      {(resourceModal?.mode === "create" || resourceModal?.mode === "edit") && (
        <ResourceFormModal
          key={
            resourceModal.mode === "edit"
              ? `edit-${resourceModal.resource.id}`
              : "create"
          }
          onClose={() => setResourceModal(null)}
          resource={
            resourceModal.mode === "edit" ? resourceModal.resource : undefined
          }
          onSave={handleSave}
          isPending={isSaving}
          categories={categories}
          isCategoriesPending={isCategoriesPending}
          isCategoriesError={isCategoriesError}
          onRetryCategories={() => void refetchCategories()}
        />
      )}
      {resourceModal?.mode === "view" && (
        <ResourceViewModal
          onClose={() => setResourceModal(null)}
          resource={resourceModal.resource}
        />
      )}
      {resourceModal?.mode === "changeStatus" && (
        <ConfirmDialog
          open
          title={
            resourceModal.resource.isActive
              ? "¿Desactivar recurso?"
              : "¿Reactivar recurso?"
          }
          description={`¿Seguro que deseas ${resourceModal.resource.isActive ? "desactivar" : "reactivar"} "${resourceModal.resource.name}"?`}
          confirmLabel={
            resourceModal.resource.isActive ? "Desactivar" : "Reactivar"
          }
          confirmColor={resourceModal.resource.isActive ? "error" : "primary"}
          onConfirm={() => handleChangeStatus(resourceModal.resource)}
          onClose={() => setResourceModal(null)}
          isPending={isChangingStatus}
        />
      )}
    </>
  );
};

function SkeletonRows() {
  return (
    <>
      <div
        className="scrollbar-custom hidden overflow-x-auto md:block"
        aria-hidden="true"
      >
        <table className="w-full min-w-180 table-fixed text-sm">
          <colgroup>
            <col className="w-[23%]" />
            <col />
            <col className="w-32" />
            <col className="w-40" />
          </colgroup>
          <thead className="bg-slate-100 dark:bg-slate-900/60">
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {["Nombre", "Categoría", "Estado", "Acciones"].map((label) => (
                <th
                  key={label}
                  scope="col"
                  className={`px-5 py-3 align-middle text-xs font-semibold text-slate-600 dark:text-slate-300 ${label === "Acciones" ? "text-right" : "text-left"}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, index) => (
              <tr
                key={index}
                className="border-b border-slate-200 last:border-0 dark:border-slate-700"
              >
                <td className="px-5 py-4">
                  <Skeleton
                    variant="rectangular"
                    className="h-4 w-32 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
                  />
                </td>
                <td className="px-5 py-4">
                  <Skeleton
                    variant="rectangular"
                    className="h-4 w-full max-w-md rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
                  />
                </td>
                <td className="px-5 py-4">
                  <Skeleton
                    variant="rectangular"
                    className="h-6 w-20 rounded-md bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
                  />
                </td>
                <td className="px-5 py-4">
                  <Skeleton
                    variant="rectangular"
                    className="h-8 w-28 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className="divide-y divide-slate-100 md:hidden dark:divide-slate-700"
        aria-hidden="true"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-3 p-4">
            <Skeleton
              variant="rectangular"
              className="h-5 w-40 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
            />
            <Skeleton
              variant="rectangular"
              className="h-4 w-full rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
            />
            <Skeleton
              variant="rectangular"
              className="h-6 w-20 rounded-md bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
            />
          </div>
        ))}
      </div>
    </>
  );
}
