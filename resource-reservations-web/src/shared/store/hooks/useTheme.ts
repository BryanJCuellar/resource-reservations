import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import type { ThemeState } from "../interfaces";
import { STORAGE_KEYS } from "../../consts";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { state, dispatch } = context;

  const theme = state;

  const setTheme = (theme: ThemeState) => {
    if (theme === "SYSTEM") {
      localStorage.removeItem(STORAGE_KEYS.theme);
    } else {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    }

    dispatch({ type: "SET_THEME", payload: { theme } });
  };

  return {
    theme,
    setTheme,
  };
};
