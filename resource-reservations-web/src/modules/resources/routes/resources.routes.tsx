import type { RouteObject } from "react-router";
import { ResourcesLayout } from "../ResourcesLayout";
import { ResourcesPage } from "../pages/ResourcesPage";

export const resourcesRoutes: RouteObject = {
  path: "resources",
  element: <ResourcesLayout />,
  children: [
    {
      index: true,
      element: <ResourcesPage />,
    },
  ],
};
