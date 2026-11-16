import type { RouteObject } from "react-router";
import { UsersLayout } from "../UsersLayout";
import { UsersPage } from "../pages/UsersPage";

export const usersRoutes: RouteObject = {
  path: "users",
  element: <UsersLayout />,
  children: [
    {
      index: true,
      element: <UsersPage />,
    },
  ],
};
