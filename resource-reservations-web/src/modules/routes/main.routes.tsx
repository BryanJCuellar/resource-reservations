import { Navigate, type RouteObject } from "react-router";
import { AppLayout } from "../AppLayout";
import { HomePage } from "../HomePage";
import { ProtectedRoutes } from "../../routes/protected.routes";
import { adminRoutes } from "./admin.routes";
import { staffRoutes } from "./staff.routes";

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
      staffRoutes,
      adminRoutes,
    ],
  },
];
