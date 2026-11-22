import { useId } from "react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import type { ResourceCategory, ResourceCategoryForm } from "../interfaces";
import { useForm, type SubmitHandler } from "react-hook-form";

interface ResourceCategoryFormModalProps {
  onClose: () => void;
  category?: ResourceCategory;
  onSave: (form: ResourceCategoryForm, id?: string) => Promise<void>;
  isPending?: boolean;
}

export function ResourceCategoryFormModal({
  onClose,
  category,
  onSave,
  isPending = false,
}: ResourceCategoryFormModalProps) {
  const formId = useId();
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResourceCategoryForm>({
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  const onSubmit: SubmitHandler<ResourceCategoryForm> = async (data) => {
    if (isPending) return;

    const sanitizedForm: ResourceCategoryForm = {
      name: data.name.trim(),
      description: data.description?.trim() || null,
    };
    await onSave(sanitizedForm, category?.id);
  };

  return (
    <Modal
      open
      onClose={onClose}
      disableClose={isPending}
      title={isEdit ? "Editar categoría" : "Nueva categoría"}
      description={
        isEdit
          ? "Actualiza el nombre o la descripción de esta categoría."
          : "Agrega una categoría para organizar los recursos reservables."
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
          >
            {isEdit ? "Guardar cambios" : "Crear categoría"}
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
          disabled={isPending}
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{
            htmlInput: { maxLength: 100 },
            formHelperText: { role: errors.name ? "alert" : undefined },
          }}
          placeholder="Escribe el nombre de la categoría"
          {...register("name", {
            required: "Ingrese el nombre de la categoría",
            maxLength: {
              value: 100,
              message: "El nombre no puede superar 100 caracteres",
            },
            validate: (value) =>
              value.trim().length > 0 || "Ingrese el nombre de la categoría",
          })}
        />
        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          disabled={isPending}
          error={!!errors.description}
          helperText={errors.description?.message}
          slotProps={{
            htmlInput: { maxLength: 500 },
            formHelperText: {
              role: errors.description ? "alert" : undefined,
            },
          }}
          placeholder="Describe brevemente esta categoría (opcional)"
          {...register("description", {
            maxLength: {
              value: 500,
              message: "La descripción no puede superar 500 caracteres",
            },
          })}
        />
      </form>
    </Modal>
  );
}
