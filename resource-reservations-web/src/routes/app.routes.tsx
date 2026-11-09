import { Navigate, useRoutes, type RouteObject } from "react-router";
import { authRoutes } from "../modules/auth/routes/auth.routes";
import { mainRoutes } from "./main.routes";
import { NotFoundPage } from "../shared/pages/NotFoundPage";
import { useAuth } from "../modules/auth/store/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../shared/components/Loading";
import { NotResponse } from "../shared/components/NotResponse";

const routes: RouteObject[] = [
  ...authRoutes,
  ...mainRoutes,
  { path: "/not-found", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/not-found" replace /> },
];

export const AppRoutes = () => {
  const element = useRoutes(routes);

  const [hasError, setHasError] = useState<boolean>(false);

  const { status, checkAuth } = useAuth();

  const handleCheckAuth = useCallback(async () => {
    setHasError(false);
    try {
      await checkAuth();
    } catch {
      setHasError(true);
    }
  }, [checkAuth]);

  useEffect(() => {
    (async () => await handleCheckAuth())();
  }, [handleCheckAuth]);

  if (hasError) {
    return (
      <NotResponse
        message="No pudimos comprobar el acceso. Intenta nuevamente."
        onRetry={handleCheckAuth}
      />
    );
  }

  if (status === "CHECKING") return <Loading />;

  return element;
};
