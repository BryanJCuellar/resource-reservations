import { useId } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmColor?: "primary" | "error";
  onConfirm: () => void;
  onClose: () => void;
  isPending?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  confirmColor = "primary",
  onConfirm,
  onClose,
  isPending = false,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  const handleClose = () => {
    if (!isPending) onClose();
  };

  const handleConfirm = () => {
    if (!isPending) onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      scroll="paper"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      slotProps={{
        paper: {
          className:
            "!m-4 !w-[calc(100%-2rem)] !max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-none bg-white p-0 text-blue-950 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:!m-6 sm:!w-[calc(100%-3rem)] sm:!max-h-[calc(100dvh-3rem)]",
        },
      }}
    >
      <DialogTitle
        id={titleId}
        component="h2"
        className="shrink-0 break-words px-6 pt-6 pb-0 text-lg font-semibold tracking-tight"
      >
        {title}
      </DialogTitle>
      <DialogContent className="scrollbar-custom min-h-0 flex-1 overflow-y-auto px-6 !pt-2 pb-5 text-sm leading-5 text-slate-600 dark:text-slate-300">
        <p id={descriptionId} className="break-words">
          {description}
        </p>
      </DialogContent>
      <DialogActions className="shrink-0 flex-col gap-2 px-6 pt-0 pb-6 [&>*+*]:ml-0 sm:flex-row sm:justify-end">
        <Button
          variant="outlined"
          autoFocus
          disabled={isPending}
          onClick={handleClose}
          className="w-full sm:w-auto"
        >
          {cancelLabel}
        </Button>
        <Button
          variant={confirmColor === "error" ? "outlined" : "contained"}
          color={confirmColor}
          loading={isPending}
          disabled={isPending}
          onClick={handleConfirm}
          className="w-full sm:w-auto"
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
