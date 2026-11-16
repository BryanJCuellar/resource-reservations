import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import { AppRoutes } from "./routes/app.routes.tsx";
import { AuthProvider } from "./modules/auth/store/providers/AuthProvider.tsx";
import { ThemeProvider } from "./shared/store/providers/ThemeProvider";
import { AppToaster } from "./shared/components/AppToaster.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyledEngineProvider } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StyledEngineProvider enableCssLayer>
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <AppToaster />
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
