import { useId, type ReactNode } from "react";
import Dialog, { type DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  disableClose?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  maxWidth = "sm",
  disableClose = false,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  const handleClose: DialogProps["onClose"] = () => {
    if (!disableClose) onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={maxWidth}
      scroll="paper"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      slotProps={{
        paper: {
          className:
            "!m-4 !w-[calc(100%-2rem)] !max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-none bg-white p-0 text-blue-950 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:!m-6 sm:!w-[calc(100%-3rem)] sm:!max-h-[calc(100dvh-3rem)]",
        },
      }}
    >
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700">
        <div className="min-w-0">
          <DialogTitle
            id={titleId}
            component="h2"
            className="break-words p-0 text-lg font-semibold tracking-tight"
          >
            {title}
          </DialogTitle>
          {description && (
            <p
              id={descriptionId}
              className="mt-1 break-words text-sm leading-5 text-slate-600 dark:text-slate-300"
            >
              {description}
            </p>
          )}
        </div>
        <IconButton
          type="button"
          aria-label="Cerrar diálogo"
          tooltip="Cerrar"
          disabled={disableClose}
          onClick={onClose}
          className="-mr-2 -mt-1"
        >
          <X aria-hidden="true" />
        </IconButton>
      </div>
      <DialogContent className="scrollbar-custom min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {children}
      </DialogContent>
      {actions && (
        <DialogActions className="min-w-0 shrink-0 flex-wrap justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-700 [&>*+*]:ml-0">
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
