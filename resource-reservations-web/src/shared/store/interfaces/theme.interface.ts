export type ThemeState = "LIGHT" | "DARK" | "SYSTEM";

export type ThemeAction = { type: "SET_THEME"; payload: { theme: ThemeState } };
