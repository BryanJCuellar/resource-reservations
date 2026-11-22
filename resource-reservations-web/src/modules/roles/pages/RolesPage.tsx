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
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { FilterSelect } from "../../../components/ui/FilterSelect";
import { IconButton } from "../../../components/ui/IconButton";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { TextField } from "../../../components/ui/TextField";
import {
  ACTIVE_STATUS_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from "../../../shared/consts";
import { RoleFormModal } from "../components/RoleFormModal";
import { RoleViewModal } from "../components/RoleViewModal";
import { useRoles } from "../hooks";
import { UserRoles } from "../../auth/consts";

export const RolesPage = () => {
  const {
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
  } = useRoles();

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-blue-950 dark:text-slate-100">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Roles
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Consulta y administra los roles de usuario.
            </p>
          </div>
          <Button
            type="button"
            variant="contained"
            disableElevation
            onClick={() => setRoleModal({ mode: "create" })}
          >
            <Plus className="size-4" aria-hidden="true" />
            Nuevo rol
          </Button>
        </header>

        <search
          aria-label="Filtros de roles"
          className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem_auto] lg:items-end"
        >
          <div className="min-w-0 flex-1">
            <TextField
              id="role-search"
              label="Buscar rol"
              fullWidth
              size="small"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Nombre del rol…"
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
              id="role-status-label"
              className="mb-2 block text-sm font-medium"
            >
              Estado
            </label>
            <FilterSelect
              id="role-status"
              labelId="role-status-label"
              value={searchRolesBy.isActive ?? ""}
              options={ACTIVE_STATUS_OPTIONS}
              onChange={(value) => {
                setSearchRolesBy((prev) => ({
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
                  No se pudieron cargar los roles
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Intenta cargar la información nuevamente.
                </p>
              </div>
              <Button
                type="button"
                variant="outlined"
                onClick={() => refetch()}
              >
                Reintentar
              </Button>
            </div>
          ) : isPending ? (
            <>
              <span role="status" className="sr-only">
                Cargando roles
              </span>
              <SkeletonRows />
            </>
          ) : (
            <>
              {/* Desktop Table */}
              <div
                className="scrollbar-custom hidden overflow-x-auto md:block"
                tabIndex={0}
                role="region"
                aria-label="Tabla de roles"
              >
                <table className="w-full min-w-150 table-fixed text-sm">
                  <caption className="sr-only">Roles de usuario</caption>
                  <colgroup>
                    <col />
                    <col className="w-32" />
                    <col className="w-40" />
                  </colgroup>
                  <thead className="bg-slate-100 dark:bg-slate-900/60">
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      {["Nombre", "Estado", "Acciones"].map((label) => (
                        <th
                          key={label}
                          scope="col"
                          className={`px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 ${label === "Acciones" ? "text-right" : "text-left"}`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {roles.map((role) => {
                      const isProtected = role.name === UserRoles.ADMIN;

                      return (
                        <tr
                          key={role.id}
                          className="border-b border-slate-100 dark:border-slate-700/80"
                        >
                          <td className="px-5 py-4 align-middle font-medium text-blue-950 dark:text-slate-100">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="wrap-anywhere">{role.name}</span>
                              {isProtected && <ProtectedRoleBadge />}
                            </div>
                          </td>
                          <td className="px-5 py-4 align-middle">
                            <StatusBadge
                              active={role.isActive}
                              label={role.isActive ? "Activo" : "Inactivo"}
                            />
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="flex justify-end">
                              <IconButton
                                type="button"
                                aria-label={`Ver rol ${role.name}`}
                                tooltip="Ver rol"
                                onClick={() =>
                                  setRoleModal({ mode: "view", role })
                                }
                              >
                                <Eye aria-hidden="true" />
                              </IconButton>
                              <IconButton
                                type="button"
                                aria-label={`Editar rol ${role.name}`}
                                tooltip={
                                  isProtected
                                    ? `El rol ${role.name} está protegido y no se puede modificar`
                                    : role.isActive
                                      ? "Editar rol"
                                      : "Reactiva el rol para editarlo"
                                }
                                disabled={!role.isActive || isProtected}
                                onClick={() =>
                                  setRoleModal({ mode: "edit", role })
                                }
                              >
                                <Pencil aria-hidden="true" />
                              </IconButton>
                              <IconButton
                                type="button"
                                aria-label={`${role.isActive ? "Desactivar" : "Reactivar"} rol ${role.name}`}
                                tooltip={
                                  isProtected
                                    ? `El rol ${role.name} está protegido y no se puede modificar`
                                    : role.isActive
                                      ? "Desactivar rol"
                                      : "Reactivar rol"
                                }
                                disabled={isProtected}
                                onClick={() =>
                                  setRoleModal({ mode: "changeStatus", role })
                                }
                              >
                                {role.isActive ? (
                                  <Archive aria-hidden="true" />
                                ) : (
                                  <ArchiveRestore aria-hidden="true" />
                                )}
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-700">
                {roles.map((role) => {
                  const isProtected = role.name === UserRoles.ADMIN;

                  return (
                    <article key={role.id} className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <h2 className="wrap-anywhere font-medium text-blue-950 dark:text-slate-100">
                            {role.name}
                          </h2>
                          {isProtected && <ProtectedRoleBadge />}
                        </div>
                        <StatusBadge
                          active={role.isActive}
                          label={role.isActive ? "Activo" : "Inactivo"}
                          showDot={false}
                        />
                      </div>
                      <div className="flex justify-end border-t border-slate-100 pt-2 dark:border-slate-700">
                        <IconButton
                          type="button"
                          aria-label={`Ver rol ${role.name}`}
                          tooltip="Ver rol"
                          onClick={() => setRoleModal({ mode: "view", role })}
                        >
                          <Eye aria-hidden="true" />
                        </IconButton>
                        <IconButton
                          type="button"
                          aria-label={`Editar rol ${role.name}`}
                          tooltip={
                            isProtected
                              ? `El rol ${role.name} está protegido y no se puede modificar`
                              : role.isActive
                                ? "Editar rol"
                                : "Reactiva el rol para editarlo"
                          }
                          disabled={!role.isActive || isProtected}
                          onClick={() => setRoleModal({ mode: "edit", role })}
                        >
                          <Pencil aria-hidden="true" />
                        </IconButton>
                        <IconButton
                          type="button"
                          aria-label={`${role.isActive ? "Desactivar" : "Reactivar"} rol ${role.name}`}
                          tooltip={
                            isProtected
                              ? `El rol ${role.name} está protegido y no se puede modificar`
                              : role.isActive
                                ? "Desactivar rol"
                                : "Reactivar rol"
                          }
                          disabled={isProtected}
                          onClick={() =>
                            setRoleModal({ mode: "changeStatus", role })
                          }
                        >
                          {role.isActive ? (
                            <Archive aria-hidden="true" />
                          ) : (
                            <ArchiveRestore aria-hidden="true" />
                          )}
                        </IconButton>
                      </div>
                    </article>
                  );
                })}
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
                      ? "No encontramos roles"
                      : "Todavía no hay roles"}
                  </h2>
                  <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-300">
                    {hasFilters
                      ? "Prueba con otra búsqueda o cambia los filtros."
                      : "Crea un rol para comenzar a clasificar las cuentas de usuario."}
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
                      onClick={() => setRoleModal({ mode: "create" })}
                      variant="contained"
                      disableElevation
                      className="mt-4 [&_svg]:size-4"
                    >
                      <Plus aria-hidden="true" /> Nuevo rol
                    </Button>
                  )}
                </div>
              )}

              {roles.length > 0 && (
                <footer className="grid grid-cols-1 items-center gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 @[480px]:grid-cols-2 @[720px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] dark:border-slate-700 dark:text-slate-300">
                  <p className="text-center @[480px]:col-start-1 @[480px]:row-start-1 @[480px]:justify-self-start @[480px]:text-left @[720px]:col-start-1 @[720px]:row-start-1">
                    {rangeStart}–{rangeEnd} de {totalItems}{" "}
                    {totalItems === 1 ? "rol" : "roles"}
                  </p>
                  <nav
                    aria-label="Paginación de roles"
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
                    <label
                      id="role-page-size-label"
                      className="whitespace-nowrap"
                    >
                      Filas por página
                    </label>
                    <FilterSelect
                      id="role-page-size"
                      labelId="role-page-size-label"
                      value={limit}
                      options={PAGE_SIZE_OPTIONS.map((value) => ({
                        label: String(value),
                        value,
                      }))}
                      onChange={(value) => {
                        setSearchRolesBy((prev) => ({
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

      {(roleModal?.mode === "create" || roleModal?.mode === "edit") && (
        <RoleFormModal
          key={
            roleModal.mode === "edit" ? `edit-${roleModal.role.id}` : "create"
          }
          onClose={() => setRoleModal(null)}
          role={roleModal.mode === "edit" ? roleModal.role : undefined}
          onSave={handleSave}
          isPending={isSaving}
        />
      )}
      {roleModal?.mode === "view" && (
        <RoleViewModal
          onClose={() => setRoleModal(null)}
          role={roleModal.role}
        />
      )}
      {roleModal?.mode === "changeStatus" && (
        <ConfirmDialog
          open
          title={
            roleModal.role.isActive ? "¿Desactivar rol?" : "¿Reactivar rol?"
          }
          description={`¿Seguro que deseas ${roleModal.role.isActive ? "desactivar" : "reactivar"} "${roleModal.role.name}"?`}
          confirmLabel={roleModal.role.isActive ? "Desactivar" : "Reactivar"}
          confirmColor={roleModal.role.isActive ? "error" : "primary"}
          onConfirm={() => handleChangeStatus(roleModal.role)}
          onClose={() => setRoleModal(null)}
          isPending={isChangingStatus}
        />
      )}
    </>
  );
};

function ProtectedRoleBadge() {
  return (
    <span className="whitespace-nowrap rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">
      Rol protegido
    </span>
  );
}

function SkeletonRows() {
  return (
    <>
      <div
        className="scrollbar-custom hidden overflow-x-auto md:block"
        aria-hidden="true"
      >
        <table className="w-full min-w-150 table-fixed text-sm">
          <colgroup>
            <col />
            <col className="w-32" />
            <col className="w-40" />
          </colgroup>
          <thead className="bg-slate-100 dark:bg-slate-900/60">
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {["Nombre", "Estado", "Acciones"].map((label) => (
                <th
                  key={label}
                  scope="col"
                  className={`px-5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 ${label === "Acciones" ? "text-right" : "text-left"}`}
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
                    className="h-6 w-20 rounded-md bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
                  />
                </td>
                <td className="px-5 py-4">
                  <Skeleton
                    variant="rectangular"
                    className="ml-auto h-8 w-28 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
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
            <div className="flex items-start justify-between gap-3">
              <Skeleton
                variant="rectangular"
                className="h-5 w-40 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
              />
              <Skeleton
                variant="rectangular"
                className="h-6 w-20 rounded-md bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
              />
            </div>
            <div className="border-t border-slate-100 pt-2 dark:border-slate-700">
              <Skeleton
                variant="rectangular"
                className="ml-auto h-8 w-28 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
