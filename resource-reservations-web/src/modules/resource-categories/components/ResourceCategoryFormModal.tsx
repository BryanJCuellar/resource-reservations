import { useId } from "react";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import type { ResourceCategory, ResourceCategoryForm } from "../interfaces";
import { useForm, type SubmitHandler } from "react-hook-form";

interface ResourceCategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  category?: ResourceCategory;
  onSave: (form: ResourceCategoryForm, id?: string) => Promise<void>;
  isPending?: boolean;
}

export function ResourceCategoryFormModal({
  open,
  onClose,
  mode,
  category,
  onSave,
  isPending = false,
}: ResourceCategoryFormModalProps) {
  const formId = useId();
  const isEdit = mode === "edit";

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
    const sanitizedForm: ResourceCategoryForm = {
      name: data.name.trim(),
      description: data.description?.trim() || null,
    };
    await onSave(sanitizedForm, isEdit ? category?.id : undefined);
  };

  return (
    <Modal
      open={open}
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
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{ formHelperText: { role: errors.name ? "alert" : undefined } }}
          placeholder="Escribe el nombre de la categoría"
          {...register("name", {
            validate: (value) =>
              value.trim().length > 0 || "Ingrese el nombre de la categoría",
          })}
        />
        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={4}
          placeholder="Describe brevemente esta categoría (opcional)"
          {...register("description")}
        />
      </form>
    </Modal>
  );
}
