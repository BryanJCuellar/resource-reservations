import { createContext } from "react";
import type { ThemeAction, ThemeState } from "../interfaces";

interface Props {
  state: ThemeState;
  dispatch: React.ActionDispatch<[action: ThemeAction]>;
}

export const ThemeContext = createContext<Props | undefined>(undefined);
