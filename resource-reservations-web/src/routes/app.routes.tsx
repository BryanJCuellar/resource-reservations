import { Navigate, useRoutes, type RouteObject } from "react-router";
import { authRoutes } from "../modules/auth/routes/auth.routes";
import { mainRoutes } from "./main.routes";
import { NotFoundPage } from "../shared/pages/NotFoundPage";

const routes: RouteObject[] = [
  ...authRoutes,
  ...mainRoutes,
  { path: "/not-found", element: <NotFoundPage /> },
  { path: "*", element: <Navigate to="/not-found" replace /> },
];

export const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};
