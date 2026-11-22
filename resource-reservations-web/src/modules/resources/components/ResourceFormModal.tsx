import { useId } from "react";
import MenuItem from "@mui/material/MenuItem";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { TextField } from "../../../components/ui/TextField";
import type { ResourceCategory } from "../../resource-categories/interfaces";
import type { Resource, ResourceForm } from "../interfaces";

interface Props {
  onClose: () => void;
  resource?: Resource;
  onSave: (form: ResourceForm, id?: string) => Promise<void>;
  isPending?: boolean;
  categories: ResourceCategory[];
  isCategoriesPending: boolean;
  isCategoriesError: boolean;
  onRetryCategories: () => void;
}

export function ResourceFormModal({
  onClose,
  resource,
  onSave,
  isPending = false,
  categories,
  isCategoriesPending,
  isCategoriesError,
  onRetryCategories,
}: Props) {
  const formId = useId();
  const isEdit = !!resource;

  const currentCategory = resource?.resourceCategory;
  const currentMissing =
    currentCategory &&
    !categories.some((category) => category.id === currentCategory.id);
  const categoryOptions = currentMissing
    ? [currentCategory, ...categories]
    : categories;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResourceForm>({
    defaultValues: {
      name: resource?.name ?? "",
      code: resource?.code ?? "",
      description: resource?.description ?? "",
      resourceCategoryId: currentCategory?.id ?? "",
    },
  });

  const onSubmit: SubmitHandler<ResourceForm> = async (data) => {
    if (isPending) return;

    const sanitizedForm: ResourceForm = {
      ...data,
      name: data.name.trim(),
      code: data.code.trim(),
      description: data.description?.trim() || null,
    };
    await onSave(sanitizedForm, resource?.id);
  };

  return (
    <Modal
      open
      onClose={onClose}
      disableClose={isPending}
      title={isEdit ? "Editar recurso" : "Nuevo recurso"}
      description={
        isEdit
          ? "Actualiza los datos o la categoría del recurso."
          : "Define el recurso y la categoría a la que pertenece."
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
            disabled={
              isCategoriesPending ||
              isCategoriesError ||
              (!currentCategory && categories.length === 0)
            }
          >
            {isEdit ? "Guardar cambios" : "Crear recurso"}
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
          {...register("name", {
            required: "Ingresa el nombre",
            maxLength: {
              value: 100,
              message: "El nombre no puede superar 100 caracteres",
            },
            validate: (value) => value.trim().length > 0 || "Ingresa el nombre",
          })}
        />
        <TextField
          label="Código"
          required
          fullWidth
          disabled={isPending}
          error={!!errors.code}
          helperText={errors.code?.message}
          slotProps={{
            htmlInput: {
              maxLength: 50,
              spellCheck: false,
              autoCorrect: "off",
              autoCapitalize: "none",
            },
            formHelperText: { role: errors.code ? "alert" : undefined },
          }}
          {...register("code", {
            required: "Ingresa el código",
            maxLength: {
              value: 50,
              message: "El código no puede superar 50 caracteres",
            },
            validate: (value) => value.trim().length > 0 || "Ingresa el código",
          })}
        />
        {isCategoriesPending ? (
          <p role="status" className="text-sm">
            Cargando categorías…
          </p>
        ) : isCategoriesError ? (
          <div role="alert" className="text-sm">
            <p>No se pudieron cargar las categorías.</p>
            <Button onClick={onRetryCategories} type="button">
              Reintentar
            </Button>
          </div>
        ) : categories.length === 0 ? (
          <p role="status" className="text-sm">
            No hay categorías activas.{" "}
            {currentCategory
              ? "Puedes conservar la categoría actual."
              : "Se necesita una categoría activa para crear el recurso."}
          </p>
        ) : null}
        <Controller
          name="resourceCategoryId"
          control={control}
          rules={{
            required: "Selecciona una categoría",
            validate: (value) =>
              value === currentCategory?.id ||
              categories.some((category) => category.id === value) ||
              "Selecciona una categoría activa",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Categoría"
              required
              fullWidth
              disabled={
                isPending ||
                isCategoriesPending ||
                isCategoriesError
              }
              error={!!errors.resourceCategoryId}
              helperText={errors.resourceCategoryId?.message}
              slotProps={{
                select: { displayEmpty: true },
                formHelperText: {
                  role: errors.resourceCategoryId ? "alert" : undefined,
                },
              }}
            >
              <MenuItem value="" disabled>
                Selecciona una categoría
              </MenuItem>
              {categoryOptions.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          )}
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
            formHelperText: { role: errors.description ? "alert" : undefined },
          }}
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
