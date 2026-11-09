import { isAxiosError } from "axios";

export const toErr = (error: unknown): string =>
  error instanceof Error ? error.message : "Ocurrió un error inesperado.";

export function handleHttpException(error: unknown): never {
  if (isAxiosError(error)) {
    if (error.response) {
      throw new Error(error.response.data?.message);
    }

    if (error.request) {
      throw new Error("No pudimos conectar con el servidor.");
    }
  }

  throw error;
}
