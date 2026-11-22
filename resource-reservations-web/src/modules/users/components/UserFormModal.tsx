import { useId } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { TextField } from "../../../components/ui/TextField";
import type { UserData, UserForm, EditUserForm } from "../interfaces";
import type { Role } from "../../roles/interfaces";

interface Props {
  user?: UserData;
  onClose: () => void;
  onCreate: (form: UserForm) => Promise<void>;
  onEdit: (form: EditUserForm, id: string) => Promise<void>;
  isPending?: boolean;
  roles: Role[];
  isRolesPending: boolean;
  isRolesError: boolean;
  onRetryRoles: () => void;
}

export function UserFormModal({
  user,
  onClose,
  onCreate,
  onEdit,
  isPending = false,
  roles,
  isRolesPending,
  isRolesError,
  onRetryRoles,
}: Props) {
  const formId = useId();
  const isEdit = !!user;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      roleId: user?.role?.id ?? "",
      password: "",
    },
  });

  const currentRole = user?.role;
  const options =
    currentRole && !roles.some((role) => role.id === currentRole.id)
      ? [currentRole, ...roles]
      : roles;
  const hasAvailableRole = Boolean(currentRole) || roles.length > 0;

  const onSubmit: SubmitHandler<UserForm> = async (data) => {
    if (isPending || isRolesPending || isRolesError || !hasAvailableRole)
      return;

    const sanitizedForm: EditUserForm = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      roleId: data.roleId,
    };

    return user
      ? await onEdit(sanitizedForm, user.id)
      : await onCreate({ ...sanitizedForm, password: data.password });
  };

  return (
    <Modal
      open
      onClose={onClose}
      disableClose={isPending}
      title={isEdit ? "Editar usuario" : "Nuevo usuario"}
      description={
        isEdit
          ? "Actualiza los datos o el rol del usuario."
          : "Completa los datos y asigna un rol al usuario."
      }
      actions={
        <>
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="contained"
            loading={isPending}
            disabled={isRolesPending || isRolesError || !hasAvailableRole}
          >
            {isEdit ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          label="Nombre"
          required
          fullWidth
          autoFocus
          disabled={isPending}
          autoComplete="name"
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{
            htmlInput: { maxLength: 100 },
            formHelperText: { role: errors.name ? "alert" : undefined },
          }}
          {...register("name", {
            required: "Ingresa el nombre",
            maxLength: { value: 100, message: "Máximo 100 caracteres" },
            validate: (value) => value.trim().length > 0 || "Ingresa el nombre",
          })}
        />
        <TextField
          label="Correo electrónico"
          type="email"
          required
          fullWidth
          autoComplete="email"
          disabled={isPending}
          error={!!errors.email}
          helperText={errors.email?.message}
          slotProps={{
            htmlInput: {
              maxLength: 254,
              autoCapitalize: "none",
              spellCheck: false,
            },
            formHelperText: { role: errors.email ? "alert" : undefined },
          }}
          {...register("email", {
            required: "Ingresa el correo electrónico",
            maxLength: { value: 254, message: "Máximo 254 caracteres" },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un correo electrónico válido",
            },
          })}
        />
        <TextField
          label="Teléfono"
          type="tel"
          fullWidth
          autoComplete="tel"
          disabled={isPending}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          slotProps={{
            htmlInput: { maxLength: 20 },
            formHelperText: { role: errors.phone ? "alert" : undefined },
          }}
          {...register("phone", {
            maxLength: { value: 20, message: "Máximo 20 caracteres" },
            validate: (value) =>
              /^(?:|\+?(?=[0-9 ()-]*[0-9])[0-9 ()-]+)$/.test(
                value?.trim() ?? "",
              ) ||
              "Usa números, espacios, guiones, paréntesis y un + inicial opcional",
          })}
        />
        {isRolesPending ? (
          <p role="status" className="text-sm">
            Cargando roles…
          </p>
        ) : isRolesError ? (
          <div role="alert" className="text-sm">
            <p>No se pudieron cargar los roles.</p>
            <Button onClick={onRetryRoles} type="button">
              Reintentar
            </Button>
          </div>
        ) : roles.length === 0 ? (
          <p role="status" className="text-sm">
            No hay roles activos.{" "}
            {currentRole
              ? "Puedes conservar el rol actual."
              : "Se necesita un rol activo para crear el usuario."}
          </p>
        ) : null}
        <Controller
          name="roleId"
          control={control}
          rules={{
            required: "Selecciona un rol",
            validate: (value) =>
              options.some((role) => role.id === value) ||
              "Selecciona un rol disponible",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              required
              fullWidth
              label="Rol"
              disabled={isPending || isRolesPending || isRolesError}
              error={!!errors.roleId}
              helperText={errors.roleId?.message}
              slotProps={{
                select: { displayEmpty: true },
                formHelperText: { role: errors.roleId ? "alert" : undefined },
              }}
            >
              <MenuItem value="" disabled>
                Selecciona un rol
              </MenuItem>
              {options.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        {!isEdit && (
          <TextField
            label="Contraseña"
            type="password"
            required
            fullWidth
            autoComplete="new-password"
            disabled={isPending}
            error={!!errors.password}
            helperText={errors.password?.message ?? "Mínimo 8 caracteres."}
            slotProps={{
              formHelperText: { role: errors.password ? "alert" : undefined },
            }}
            {...register("password", {
              required: "Ingresa una contraseña",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            })}
          />
        )}
      </form>
    </Modal>
  );
}
