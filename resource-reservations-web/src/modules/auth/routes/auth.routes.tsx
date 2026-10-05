import { Navigate, type RouteObject } from "react-router";
import { LoginPage } from "../pages/LoginPage";
import { AuthLayout } from "../AuthLayout";

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
];
