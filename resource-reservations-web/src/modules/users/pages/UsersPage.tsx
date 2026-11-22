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
import { IconButton } from "../../../components/ui/IconButton";
import { TextField } from "../../../components/ui/TextField";
import { FilterSelect } from "../../../components/ui/FilterSelect";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import {
  ACTIVE_STATUS_OPTIONS,
  PAGE_SIZE_OPTIONS,
} from "../../../shared/consts";
import { UserFormModal } from "../components/UserFormModal";
import { UserViewModal } from "../components/UserViewModal";
import { useUsers } from "../hooks/useUsers";

export const UsersPage = () => {
  const {
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
    isRolesPending,
    isRolesError,
    refetchRoles,
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
    handleCreate,
    handleEdit,
    handleChangeStatus,
  } = useUsers();

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-blue-950 dark:text-slate-100">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Usuarios
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Administra las cuentas y los roles de los usuarios.
            </p>
          </div>
          <Button
            type="button"
            variant="contained"
            disableElevation
            onClick={() => setUserModal({ mode: "create" })}
          >
            <Plus className="size-4" aria-hidden="true" /> Nuevo usuario
          </Button>
        </header>
        <search
          className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_auto] lg:items-end"
          aria-label="Filtros de usuarios"
        >
          <TextField
            id="user-search"
            label="Buscar usuario"
            fullWidth
            size="small"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Nombre o correo electrónico…"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="size-4" aria-hidden="true" />
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
            }}
          />
          <div className="min-w-0">
            <label
              id="user-role-label"
              className="mb-2 block text-sm font-medium"
            >
              Rol
            </label>
            <FilterSelect
              id="user-role"
              labelId="user-role-label"
              value={searchUsersBy.roleId ?? ""}
              options={rolesOpts}
              onChange={(value) =>
                setSearchUsersBy((prev) => ({
                  ...prev,
                  roleId: value || undefined,
                  page: 1,
                }))
              }
              className="w-full min-w-0"
            />
            {isRolesPending && (
              <p
                role="status"
                className="mt-1 text-xs text-slate-600 dark:text-slate-300"
              >
                Cargando roles…
              </p>
            )}
            {isRolesError && (
              <div
                role="alert"
                className="mt-1 text-xs text-red-600 dark:text-red-300"
              >
                <p>No se pudieron cargar los roles.</p>
                <Button
                  type="button"
                  size="small"
                  onClick={() => refetchRoles()}
                >
                  Reintentar
                </Button>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <label
              id="user-status-label"
              className="mb-2 block text-sm font-medium"
            >
              Estado
            </label>
            <FilterSelect
              id="user-status"
              labelId="user-status-label"
              value={searchUsersBy.isActive ?? ""}
              options={ACTIVE_STATUS_OPTIONS}
              onChange={(value) =>
                setSearchUsersBy((prev) => ({
                  ...prev,
                  isActive: (value as "true" | "false") || undefined,
                  page: 1,
                }))
              }
              className="w-full"
            />
          </div>
          <Button
            type="button"
            size="small"
            disabled={!hasFilters}
            onClick={clearFilters}
            className="w-full lg:w-auto"
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
                  No se pudieron cargar los usuarios
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
                Cargando usuarios
              </span>
              <SkeletonRows />
            </>
          ) : (
            <>
              {/* Desktop Table */}
              <div
                role="region"
                aria-label="Tabla de usuarios"
                tabIndex={0}
                className="scrollbar-custom hidden overflow-x-auto focus-visible:outline-2 focus-visible:outline-blue-700 md:block dark:focus-visible:outline-blue-300"
              >
                <table className="w-full min-w-240 table-fixed text-sm">
                  <caption className="sr-only">Usuarios</caption>
                  <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[24%]" />
                    <col />
                    <col className="w-32" />
                    <col className="w-28" />
                    <col className="w-36" />
                  </colgroup>
                  <thead className="bg-slate-100 dark:bg-slate-900/60">
                    <tr>
                      {[
                        "Nombre",
                        "Correo electrónico",
                        "Teléfono",
                        "Rol",
                        "Estado",
                        "Acciones",
                      ].map((label) => (
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
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-100 last:border-0 dark:border-slate-700/80"
                      >
                        <td className="px-5 py-4 font-medium wrap-anywhere">
                          {user.name}
                        </td>
                        <td className="px-5 py-4 wrap-anywhere text-slate-600 dark:text-slate-300">
                          {user.email}
                        </td>
                        <td className="px-5 py-4 wrap-anywhere text-slate-600 dark:text-slate-300">
                          {user.phone || "—"}
                        </td>
                        <td className="px-5 py-4 wrap-anywhere">
                          {user.role?.name || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge
                            active={user.isActive}
                            label={user.isActive ? "Activo" : "Inactivo"}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <IconButton
                              type="button"
                              aria-label={`Ver usuario ${user.name}`}
                              tooltip="Ver usuario"
                              onClick={() =>
                                setUserModal({ mode: "view", user })
                              }
                            >
                              <Eye aria-hidden="true" />
                            </IconButton>
                            <IconButton
                              type="button"
                              aria-label={`Editar usuario ${user.name}`}
                              tooltip={
                                user.isActive
                                  ? "Editar usuario"
                                  : "Reactiva el usuario para editarlo"
                              }
                              disabled={!user.isActive}
                              onClick={() =>
                                setUserModal({ mode: "edit", user })
                              }
                            >
                              <Pencil aria-hidden="true" />
                            </IconButton>
                            <IconButton
                              type="button"
                              aria-label={`${user.isActive ? "Desactivar" : "Reactivar"} usuario ${user.name}`}
                              tooltip={
                                user.isActive
                                  ? "Desactivar usuario"
                                  : "Reactivar usuario"
                              }
                              onClick={() =>
                                setUserModal({ mode: "changeStatus", user })
                              }
                            >
                              {user.isActive ? (
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
                {users.map((user) => (
                  <article key={user.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 font-medium wrap-anywhere">
                        {user.name}
                      </h2>
                      <StatusBadge
                        active={user.isActive}
                        label={user.isActive ? "Activo" : "Inactivo"}
                        showDot={false}
                      />
                    </div>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="sr-only">Correo electrónico</dt>
                        <dd className="wrap-anywhere text-slate-600 dark:text-slate-300">
                          {user.email}
                        </dd>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <dt className="text-slate-600 dark:text-slate-300">
                          Teléfono
                        </dt>
                        <dd>{user.phone || "Sin teléfono"}</dd>
                      </div>
                      <div className="flex justify-between gap-2">
                        <dt className="text-slate-600 dark:text-slate-300">
                          Rol
                        </dt>
                        <dd>{user.role?.name || "Sin rol"}</dd>
                      </div>
                    </dl>
                    <div className="border-t border-slate-100 pt-2 dark:border-slate-700">
                      <div className="flex justify-end">
                        <IconButton
                          type="button"
                          aria-label={`Ver usuario ${user.name}`}
                          tooltip="Ver usuario"
                          onClick={() => setUserModal({ mode: "view", user })}
                        >
                          <Eye aria-hidden="true" />
                        </IconButton>
                        <IconButton
                          type="button"
                          aria-label={`Editar usuario ${user.name}`}
                          tooltip={
                            user.isActive
                              ? "Editar usuario"
                              : "Reactiva el usuario para editarlo"
                          }
                          disabled={!user.isActive}
                          onClick={() => setUserModal({ mode: "edit", user })}
                        >
                          <Pencil aria-hidden="true" />
                        </IconButton>
                        <IconButton
                          type="button"
                          aria-label={`${user.isActive ? "Desactivar" : "Reactivar"} usuario ${user.name}`}
                          tooltip={
                            user.isActive
                              ? "Desactivar usuario"
                              : "Reactivar usuario"
                          }
                          onClick={() =>
                            setUserModal({ mode: "changeStatus", user })
                          }
                        >
                          {user.isActive ? (
                            <Archive aria-hidden="true" />
                          ) : (
                            <ArchiveRestore aria-hidden="true" />
                          )}
                        </IconButton>
                      </div>
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
                      ? "No encontramos usuarios"
                      : "Todavía no hay usuarios"}
                  </h2>
                  <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-300">
                    {hasFilters
                      ? "Prueba con otra búsqueda o cambia los filtros."
                      : "Crea un usuario para comenzar."}
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
                      onClick={() => setUserModal({ mode: "create" })}
                      variant="contained"
                      disableElevation
                      className="mt-4 [&_svg]:size-4"
                    >
                      <Plus aria-hidden="true" /> Nuevo usuario
                    </Button>
                  )}
                </div>
              )}
              {users.length > 0 && (
                <footer className="grid grid-cols-1 items-center gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 @[480px]:grid-cols-2 @[720px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] dark:border-slate-700 dark:text-slate-300">
                  <p className="text-center @[480px]:col-start-1 @[480px]:row-start-1 @[480px]:justify-self-start @[480px]:text-left @[720px]:col-start-1 @[720px]:row-start-1">
                    {rangeStart}–{rangeEnd} de {totalItems}{" "}
                    {totalItems === 1 ? "usuario" : "usuarios"}
                  </p>
                  <nav
                    aria-label="Paginación de usuarios"
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
                      id="user-page-size-label"
                      className="whitespace-nowrap"
                    >
                      Filas por página
                    </label>
                    <FilterSelect
                      id="user-page-size"
                      labelId="user-page-size-label"
                      value={limit}
                      options={PAGE_SIZE_OPTIONS.map((value) => ({
                        label: String(value),
                        value,
                      }))}
                      onChange={(value) =>
                        setSearchUsersBy((prev) => ({
                          ...prev,
                          limit: value,
                          page: 1,
                        }))
                      }
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
      {(userModal?.mode === "create" || userModal?.mode === "edit") && (
        <UserFormModal
          key={
            userModal.mode === "edit" ? `edit-${userModal.user.id}` : "create"
          }
          user={userModal.mode === "edit" ? userModal.user : undefined}
          onClose={() => setUserModal(null)}
          onCreate={handleCreate}
          onEdit={handleEdit}
          isPending={isSaving}
          roles={roles}
          isRolesPending={isRolesPending}
          isRolesError={isRolesError}
          onRetryRoles={() => void refetchRoles()}
        />
      )}
      {userModal?.mode === "view" && (
        <UserViewModal
          onClose={() => setUserModal(null)}
          user={userModal.user}
        />
      )}
      {userModal?.mode === "changeStatus" && (
        <ConfirmDialog
          open
          title={
            userModal.user.isActive
              ? "¿Desactivar usuario?"
              : "¿Reactivar usuario?"
          }
          description={`¿Seguro que deseas ${userModal.user.isActive ? "desactivar" : "reactivar"} "${userModal.user.name}"?`}
          confirmLabel={userModal.user.isActive ? "Desactivar" : "Reactivar"}
          confirmColor={userModal.user.isActive ? "error" : "primary"}
          onClose={() => setUserModal(null)}
          onConfirm={() => handleChangeStatus(userModal.user)}
          isPending={isChangingStatus}
        />
      )}
    </>
  );
};

function SkeletonRows() {
  const labels = [
    "Nombre",
    "Correo electrónico",
    "Teléfono",
    "Rol",
    "Estado",
    "Acciones",
  ];

  return (
    <>
      <div
        className="scrollbar-custom hidden overflow-x-auto md:block"
        aria-hidden="true"
      >
        <table className="w-full min-w-240 table-fixed text-sm">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[24%]" />
            <col />
            <col className="w-32" />
            <col className="w-28" />
            <col className="w-36" />
          </colgroup>
          <thead className="bg-slate-100 dark:bg-slate-900/60">
            <tr>
              {labels.map((label) => (
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
                    className="h-4 w-full max-w-md rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
                  />
                </td>
                <td className="px-5 py-4">
                  <Skeleton
                    variant="rectangular"
                    className="h-4 w-32 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
                  />
                </td>
                <td className="px-5 py-4">
                  <Skeleton
                    variant="rectangular"
                    className="h-4 w-20 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
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
            <Skeleton
              variant="rectangular"
              className="h-4 w-full rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
            />
            <Skeleton
              variant="rectangular"
              className="h-4 w-2/3 rounded bg-slate-200 motion-reduce:animate-none dark:bg-slate-700"
            />
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
