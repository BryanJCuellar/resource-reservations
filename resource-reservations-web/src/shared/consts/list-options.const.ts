import type { SelectOption } from "../interfaces";

export const ACTIVE_STATUS_OPTIONS: SelectOption[] = [
  { label: "Todos los estados", value: "" },
  { label: "Activo", value: "true" },
  { label: "Inactivo", value: "false" },
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50];
