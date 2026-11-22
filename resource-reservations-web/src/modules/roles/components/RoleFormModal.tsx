import { useId } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import { UserRoles } from "../../auth/consts";
import type { Role, RoleForm } from "../interfaces";

interface RoleFormModalProps {
  onClose: () => void;
  role?: Role;
  onSave: (form: RoleForm, id?: string) => Promise<void>;
  isPending?: boolean;
}

export function RoleFormModal({
  onClose,
  role,
  onSave,
  isPending = false,
}: RoleFormModalProps) {
  const formId = useId();
  const isEdit = !!role;
  const isProtected = isEdit && role?.name === UserRoles.ADMIN;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleForm>({
    defaultValues: { name: role?.name ?? "" },
  });

  const onSubmit: SubmitHandler<RoleForm> = async (data) => {
    if (isProtected) return;

    await onSave({ name: data.name.trim() }, role?.id);
  };

  return (
    <Modal
      open
      onClose={onClose}
      disableClose={isPending}
      title={isEdit ? "Editar rol" : "Nuevo rol"}
      description={
        isEdit
          ? isProtected
            ? "El rol ADMIN está protegido y no se puede modificar"
            : "Actualiza el nombre de este rol."
          : "Agrega un rol para clasificar las cuentas de usuario."
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
            disabled={isPending || isProtected}
          >
            {isEdit ? "Guardar cambios" : "Crear rol"}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <TextField
          label="Nombre"
          required
          fullWidth
          autoFocus
          disabled={isPending || isProtected}
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{
            htmlInput: { maxLength: 50 },
            formHelperText: { role: errors.name ? "alert" : undefined },
          }}
          placeholder="Escribe el nombre del rol"
          {...register("name", {
            required: "Ingrese el nombre del rol",
            maxLength: {
              value: 50,
              message: "El nombre no puede superar 50 caracteres",
            },
            validate: (value) =>
              value.trim().length > 0 || "Ingrese el nombre del rol",
          })}
        />
      </form>
    </Modal>
  );
}
