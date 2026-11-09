import { Navigate, type RouteObject } from "react-router";
import { AuthLayout } from "../AuthLayout";
import { PublicOnlyRoutes } from "../../../routes/public-only.routes";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: (
      <PublicOnlyRoutes>
        <AuthLayout />
      </PublicOnlyRoutes>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
];
