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
import { ResourceCategoryFormModal } from "../components/ResourceCategoryFormModal";
import { ResourceCategoryViewModal } from "../components/ResourceCategoryViewModal";
import { useResourceCategories } from "../hooks";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";

export const ResourceCategoriesPage = () => {
  const {
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
  } = useResourceCategories();

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-blue-950 dark:text-slate-100">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Categorías de recursos
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Organiza los tipos de recursos que se pueden reservar.
            </p>
          </div>
          <Button
            type="button"
            variant="contained"
            disableElevation
            onClick={() => setCategoryModal({ mode: "create" })}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nueva categoría
          </Button>
        </header>

        <search
          aria-label="Filtros de categorías"
          className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem_auto] lg:items-end"
        >
          <div className="min-w-0 flex-1">
            <TextField
              id="category-search"
              label="Buscar categoría"
              fullWidth
              size="small"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Nombre o descripción…"
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

          <div className="w-full shrink-0 lg:w-56">
            <label
              id="category-status-label"
              className="mb-2 block text-sm font-medium"
            >
              Estado
            </label>
            <FilterSelect
              id="category-status"
              labelId="category-status-label"
              value={searchResourceCategoriesBy.isActive ?? ""}
              options={ACTIVE_STATUS_OPTIONS}
              onChange={(value) => {
                setSearchResourceCategoriesBy((prev) => ({
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
                  No se pudieron cargar las categorías
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
                Cargando categorías
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
                aria-label="Tabla de categorías de recursos"
              >
                <table className="w-full min-w-180 table-fixed text-sm">
                  <caption className="sr-only">Categorías de recursos</caption>
                  <colgroup>
                    <col className="w-[23%]" />
                    <col />
                    <col className="w-32" />
                    <col className="w-40" />
                  </colgroup>
                  <thead className="bg-slate-100 dark:bg-slate-900/60">
                    <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-transparent">
                      {["Nombre", "Descripción", "Estado", "Acciones"].map(
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
                    {resourceCategories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-slate-100 dark:border-slate-700/80"
                      >
                        <td className="align-middle px-5 py-4 font-medium text-blue-950 wrap-anywhere dark:text-slate-100">
                          {category.name}
                        </td>
                        <td className="align-middle min-w-0 px-5 py-4">
                          <p className="line-clamp-2 whitespace-normal text-sm leading-5 text-slate-600 wrap-anywhere dark:text-slate-300">
                            {category.description || (
                              <span className="italic text-slate-400">—</span>
                            )}
                          </p>
                        </td>
                        <td className="align-middle px-5 py-4">
                          <StatusBadge
                            active={category.isActive}
                            label={category.isActive ? "Activo" : "Inactivo"}
                          />
                        </td>
                        <td className="align-middle px-4 py-3">
                          <div className="flex justify-end">
                            <IconButton
                              type="button"
                              aria-label={`Ver categoría ${category.name}`}
                              tooltip="Ver categoría"
                              onClick={() =>
                                setCategoryModal({ mode: "view", category })
                              }
                            >
                              <Eye aria-hidden="true" />
                            </IconButton>
                            <IconButton
                              type="button"
                              aria-label={`Editar categoría ${category.name}`}
                              tooltip={
                                category.isActive
                                  ? "Editar categoría"
                                  : "Reactiva la categoría para editarla"
                              }
                              disabled={!category.isActive}
                              onClick={() =>
                                setCategoryModal({ mode: "edit", category })
                              }
                            >
                              <Pencil aria-hidden="true" />
                            </IconButton>
                            <IconButton
                              type="button"
                              aria-label={
                                category.isActive
                                  ? `Desactivar categoría ${category.name}`
                                  : `Reactivar categoría ${category.name}`
                              }
                              tooltip={
                                category.isActive
                                  ? "Desactivar categoría"
                                  : "Reactivar categoría"
                              }
                              onClick={() =>
                                setCategoryModal({
                                  mode: "changeStatus",
                                  category,
                                })
                              }
                            >
                              {category.isActive ? (
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
                {resourceCategories.map((category) => (
                  <article key={category.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 wrap-anywhere font-medium text-blue-950 dark:text-slate-100">
                        {category.name}
                      </h2>
                      <StatusBadge
                        active={category.isActive}
                        label={category.isActive ? "Activo" : "Inactivo"}
                        showDot={false}
                      />
                    </div>
                    <p className="line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
                      {category.description || (
                        <span className="italic text-slate-400">—</span>
                      )}
                    </p>
                    <div className="flex justify-end border-t border-slate-100 pt-2 dark:border-slate-700">
                      <IconButton
                        type="button"
                        aria-label={`Ver categoría ${category.name}`}
                        tooltip="Ver categoría"
                        onClick={() =>
                          setCategoryModal({ mode: "view", category })
                        }
                      >
                        <Eye aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        type="button"
                        aria-label={`Editar categoría ${category.name}`}
                        tooltip={
                          category.isActive
                            ? "Editar categoría"
                            : "Reactiva la categoría para editarla"
                        }
                        disabled={!category.isActive}
                        onClick={() =>
                          setCategoryModal({ mode: "edit", category })
                        }
                      >
                        <Pencil aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        type="button"
                        aria-label={
                          category.isActive
                            ? `Desactivar categoría ${category.name}`
                            : `Reactivar categoría ${category.name}`
                        }
                        tooltip={
                          category.isActive
                            ? "Desactivar categoría"
                            : "Reactivar categoría"
                        }
                        onClick={() =>
                          setCategoryModal({ mode: "changeStatus", category })
                        }
                      >
                        {category.isActive ? (
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
                      ? "No encontramos categorías"
                      : "Todavía no hay categorías"}
                  </h2>
                  <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-300">
                    {hasFilters
                      ? "Prueba con otra búsqueda o cambia los filtros."
                      : "Crea una categoría para comenzar a organizar los recursos."}
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
                      onClick={() => setCategoryModal({ mode: "create" })}
                      variant="contained"
                      disableElevation
                      className="mt-4 [&_svg]:size-4"
                    >
                      <Plus aria-hidden="true" /> Nueva categoría
                    </Button>
                  )}
                </div>
              )}

              {resourceCategories.length > 0 && (
                <footer className="grid grid-cols-1 items-center gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 @[480px]:grid-cols-2 @[720px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] dark:border-slate-700 dark:text-slate-300">
                  <p className="text-center @[480px]:col-start-1 @[480px]:row-start-1 @[480px]:justify-self-start @[480px]:text-left @[720px]:col-start-1 @[720px]:row-start-1">
                    {rangeStart}–{rangeEnd} de {totalItems}{" "}
                    {totalItems === 1 ? "categoría" : "categorías"}
                  </p>
                  <nav
                    aria-label="Paginación de categorías"
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
                        setSearchResourceCategoriesBy((prev) => ({
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
      {(categoryModal?.mode === "create" || categoryModal?.mode === "edit") && (
        <ResourceCategoryFormModal
          key={
            categoryModal.mode === "edit"
              ? `edit-${categoryModal.category.id}`
              : "create"
          }
          onClose={() => setCategoryModal(null)}
          category={
            categoryModal.mode === "edit" ? categoryModal.category : undefined
          }
          onSave={handleSave}
          isPending={isSaving}
        />
      )}
      {categoryModal?.mode === "view" && (
        <ResourceCategoryViewModal
          onClose={() => setCategoryModal(null)}
          category={categoryModal.category}
        />
      )}
      {categoryModal?.mode === "changeStatus" && (
        <ConfirmDialog
          open
          title={
            categoryModal.category.isActive
              ? "¿Desactivar categoría?"
              : "¿Reactivar categoría?"
          }
          description={`¿Seguro que deseas ${categoryModal.category.isActive ? "desactivar" : "reactivar"} "${categoryModal.category.name}"?`}
          confirmLabel={
            categoryModal.category.isActive ? "Desactivar" : "Reactivar"
          }
          confirmColor={categoryModal.category.isActive ? "error" : "primary"}
          onConfirm={() => handleChangeStatus(categoryModal.category)}
          onClose={() => setCategoryModal(null)}
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
              {["Nombre", "Descripción", "Estado", "Acciones"].map((label) => (
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
