import { useEffect, useReducer } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { themeReducer, themeReducerInitState } from "../reducers/theme.reducer";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

interface Props {
  children: React.ReactNode;
}

/** ThemeProvider + Material UI ThemeProvider */
export const ThemeProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(themeReducer, themeReducerInitState);

  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  const isDark = state === "DARK" || (state === "SYSTEM" && systemPrefersDark);

  const muiTheme = createTheme({
    typography: {
      fontFamily: '"Manrope", sans-serif',
    },
    palette: {
      mode: isDark ? "dark" : "light",
    },
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
