import type { RouteObject } from "react-router";
import { RolesLayout } from "../RolesLayout";
import { RolesPage } from "../pages/RolesPage";

export const rolesRoutes: RouteObject = {
  path: "roles",
  element: <RolesLayout />,
  children: [
    {
      index: true,
      element: <RolesPage />,
    },
  ],
};
