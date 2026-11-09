import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import { AppRoutes } from "./routes/app.routes.tsx";
import { AuthProvider } from "./modules/auth/store/providers/AuthProvider.tsx";
import { ThemeProvider } from "./shared/store/providers/ThemeProvider";
import { AppToaster } from "./shared/components/AppToaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppToaster />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
