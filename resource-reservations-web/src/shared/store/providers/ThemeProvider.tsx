import { useEffect, useReducer } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { themeReducer, themeReducerInitState } from "../reducers/theme.reducer";

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(themeReducer, themeReducerInitState);

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark =
        state === "DARK" || (state === "SYSTEM" && systemTheme.matches);

      document.documentElement.classList.toggle("dark", isDark);
    };

    applyTheme();

    if (state !== "SYSTEM") return;

    systemTheme.addEventListener("change", applyTheme);

    return () => systemTheme.removeEventListener("change", applyTheme);
  }, [state]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  );
};
