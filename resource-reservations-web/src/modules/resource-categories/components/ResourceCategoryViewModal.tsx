import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { ResourceCategory } from "../interfaces";

interface ResourceCategoryViewModalProps {
  onClose: () => void;
  category: Pick<ResourceCategory, "name" | "description" | "isActive">;
}

export function ResourceCategoryViewModal({
  onClose,
  category,
}: ResourceCategoryViewModalProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Detalles de categoría"
      description="Información de la categoría seleccionada."
      actions={
        <Button type="button" variant="contained" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <dl className="flex flex-col gap-5">
        <div className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Nombre
          </dt>
          <dd className="min-w-0 text-sm font-medium text-blue-950 wrap-anywhere dark:text-slate-100">
            {category.name}
          </dd>
        </div>

        <div className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Descripción
          </dt>
          <dd className="min-w-0 whitespace-pre-wrap text-sm leading-6 text-blue-950 wrap-anywhere dark:text-slate-100">
            {category.description || (
              <span>
                <span aria-hidden="true">—</span>
                <span className="sr-only">Sin descripción</span>
              </span>
            )}
          </dd>
        </div>

        <div className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Estado
          </dt>
          <dd className="min-w-0">
            <StatusBadge
              active={category.isActive}
              label={category.isActive ? "Activo" : "Inactivo"}
              showDot={false}
            />
          </dd>
        </div>
      </dl>
    </Modal>
  );
}
