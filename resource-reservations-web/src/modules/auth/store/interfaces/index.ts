import type { AuthenticatedUser } from "../../interfaces";

export interface AuthState {
  status: "CHECKING" | "AUTHENTICATED" | "NOT_AUTHENTICATED";
  authenticatedUser: AuthenticatedUser | null;
}

export type AuthAction =
  | { type: "CHECKING" }
  | { type: "LOGIN"; payload: { user: AuthenticatedUser } }
  | { type: "LOGOUT" };
