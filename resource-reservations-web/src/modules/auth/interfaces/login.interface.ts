import type { AuthenticatedUser } from "./auth.inteface";

export interface LoginFormErrors {
  email?: string | undefined;
  password?: string | undefined;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}
