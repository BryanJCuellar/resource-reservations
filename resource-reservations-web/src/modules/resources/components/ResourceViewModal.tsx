import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Resource } from "../interfaces";
interface Props {
  onClose: () => void;
  resource: Resource;
}
export function ResourceViewModal({ onClose, resource }: Props) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Detalles del recurso"
      description="Información del recurso seleccionado."
      actions={
        <Button type="button" variant="contained" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <dl className="flex flex-col gap-5">
        {[
          ["Nombre", resource.name],
          ["Código", resource.code],
          ["Categoría", resource.resourceCategory?.name],
          ["Descripción", resource.description || "Sin descripción"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {label}
            </dt>
            <dd
              className={`min-w-0 text-sm wrap-anywhere ${label === "Nombre" ? "font-medium text-blue-950 dark:text-slate-100" : "whitespace-pre-wrap leading-6"}`}
            >
              {value}
            </dd>
          </div>
        ))}
        <div className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Estado
          </dt>
          <dd>
            <StatusBadge
              active={resource.isActive}
              label={resource.isActive ? "Activo" : "Inactivo"}
              showDot={false}
            />
          </dd>
        </div>
      </dl>
    </Modal>
  );
}
