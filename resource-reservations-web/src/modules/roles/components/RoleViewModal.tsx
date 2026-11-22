import { Button } from "../../../components/ui/Button";
import { Modal } from "../../../components/ui/Modal";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { Role } from "../interfaces";

interface RoleViewModalProps {
  onClose: () => void;
  role: Pick<Role, "name" | "isActive">;
}

export function RoleViewModal({ onClose, role }: RoleViewModalProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Detalles del rol"
      description="Información del rol seleccionado."
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
            {role.name}
          </dd>
        </div>

        <div className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Estado
          </dt>
          <dd className="min-w-0">
            <StatusBadge
              active={role.isActive}
              label={role.isActive ? "Activo" : "Inactivo"}
              showDot={false}
            />
          </dd>
        </div>
      </dl>
    </Modal>
  );
}
