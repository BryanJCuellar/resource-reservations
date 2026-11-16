import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import type { ResourceCategory } from "../interfaces";

interface ResourceCategoryViewModalProps {
  open: boolean;
  onClose: () => void;
  category?: Pick<ResourceCategory, "name" | "description" | "isActive">;
}

const exampleCategory = {
  name: "Sala de reuniones",
  description: "Espacios disponibles para reuniones de equipo.",
  isActive: true,
};

export function ResourceCategoryViewModal({
  open,
  onClose,
  category,
}: ResourceCategoryViewModalProps) {
  const selectedCategory = category ?? exampleCategory;

  return (
    <Modal
      open={open}
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
          <dd className="min-w-0 break-words text-sm font-medium text-blue-950 [overflow-wrap:anywhere] dark:text-slate-100">
            {selectedCategory.name}
          </dd>
        </div>

        <div className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Descripción
          </dt>
          <dd className="min-w-0 whitespace-pre-wrap break-words text-sm leading-6 text-blue-950 [overflow-wrap:anywhere] dark:text-slate-100">
            {selectedCategory.description || (
              <span aria-label="Sin descripción">—</span>
            )}
          </dd>
        </div>

        <div className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Estado
          </dt>
          <dd className="min-w-0">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                selectedCategory.isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {selectedCategory.isActive ? "Activo" : "Inactivo"}
            </span>
          </dd>
        </div>
      </dl>
    </Modal>
  );
}
