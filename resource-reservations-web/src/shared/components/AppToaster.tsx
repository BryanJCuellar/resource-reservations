import { Toaster } from "sonner";
import { useTheme } from "../store/hooks/useTheme";

export const AppToaster = () => {
  const { theme } = useTheme();

  const toasterTheme =
    theme === "LIGHT" ? "light" : theme === "DARK" ? "dark" : "system";

  return (
    <Toaster
      theme={toasterTheme}
      position="top-right"
      richColors
      toastOptions={{ duration: 4000 }}
    />
  );
};
