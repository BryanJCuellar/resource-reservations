import { Outlet, type RouteObject } from "react-router";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRoles } from "../auth/consts";
import { resourcesRoutes } from "../resources/routes/resources.routes";

export const staffRoutes: RouteObject = {
  element: (
    <RolesGuard roles={[UserRoles.STAFF]}>
      <Outlet />
    </RolesGuard>
  ),
  children: [resourcesRoutes],
};
