import { Navigate, type RouteObject } from "react-router";
import { AppLayout } from "../modules/AppLayout";
import { HomePage } from "../modules/HomePage";
import { ProtectedRoutes } from "./protected.routes";

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoutes>
        <AppLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
    ],
  },
];
