import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import type { UserData } from "../interfaces";
const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleString("es-HN") : "—";

interface UserViewModalProps {
  onClose: () => void;
  user: UserData;
}

export function UserViewModal({ onClose, user }: UserViewModalProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Detalles del usuario"
      description="Información del usuario seleccionado."
      actions={
        <Button type="button" variant="contained" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <dl className="flex flex-col gap-5">
        {[
          ["Nombre", user.name],
          ["Correo electrónico", user.email],
          ["Teléfono", user.phone || "Sin teléfono"],
          ["Rol", user.role?.name || "Sin rol"],
          ["Creado", formatDate(user.createdAt)],
          ["Actualizado", formatDate(user.updatedAt)],
          ["Desactivado", formatDate(user.deletedAt)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {label}
            </dt>
            <dd
              className={`min-w-0 text-sm wrap-anywhere ${label === "Nombre" ? "font-medium text-blue-950 dark:text-slate-100" : ""}`}
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
              active={user.isActive}
              label={user.isActive ? "Activo" : "Inactivo"}
              showDot={false}
            />
          </dd>
        </div>
      </dl>
    </Modal>
  );
}
