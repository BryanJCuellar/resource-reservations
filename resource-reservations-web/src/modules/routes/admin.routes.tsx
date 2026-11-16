import { Navigate, Outlet, type RouteObject } from "react-router";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRoles } from "../auth/consts";
import { usersRoutes } from "../users/routes/users.routes";
import { rolesRoutes } from "../roles/routes/roles.routes";
import { resourceCategoriesRoutes } from "../resource-categories/routes/resource-categories.routes";
import { resourcesRoutes } from "../resources/routes/resources.routes";

export const adminRoutes: RouteObject = {
  path: "admin",
  element: (
    <RolesGuard roles={[UserRoles.ADMIN]}>
      <Outlet />
    </RolesGuard>
  ),
  children: [
    {
      index: true,
      element: <Navigate to="users" replace />,
    },
    usersRoutes,
    rolesRoutes,
    resourcesRoutes,
    resourceCategoriesRoutes,
  ],
};
