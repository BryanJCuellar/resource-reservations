import { STORAGE_KEYS } from "../../consts";
import type { ThemeAction, ThemeState } from "../interfaces";

const initialTheme = (): ThemeState => {
  const theme = localStorage.getItem(STORAGE_KEYS.theme);
  if (!theme) return "SYSTEM";
  const isValidTheme = ["LIGHT", "DARK"].includes(theme);
  return isValidTheme ? (theme as ThemeState) : "SYSTEM";
};

export const themeReducerInitState: ThemeState = initialTheme();

export const themeReducer = (
  state: ThemeState = themeReducerInitState,
  action: ThemeAction,
): ThemeState => {
  switch (action.type) {
    case "SET_THEME":
      return action.payload.theme;

    default:
      return state;
  }
};
