import { Navigate, type RouteObject } from "react-router";
import { AppLayout } from "../modules/AppLayout";
import { HomePage } from "../modules/HomePage";
import { ProtectedRoute } from "../modules/ProtectedRoute";

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
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
