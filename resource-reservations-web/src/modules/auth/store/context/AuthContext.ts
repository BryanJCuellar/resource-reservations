import { createContext } from "react";
import type { AuthAction, AuthState } from "../interfaces";

interface Props {
  state: AuthState;
  dispatch: React.ActionDispatch<[action: AuthAction]>;
}

export const AuthContext = createContext<Props | undefined>(undefined);
