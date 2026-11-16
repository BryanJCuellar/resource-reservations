import type { RouteObject } from "react-router";
import { ResourceCategoriesLayout } from "../ResourceCategoriesLayout";
import { ResourceCategoriesPage } from "../pages/ResourceCategoriesPage";

export const resourceCategoriesRoutes: RouteObject = {
  path: "resource-categories",
  element: <ResourceCategoriesLayout />,
  children: [
    {
      index: true,
      element: <ResourceCategoriesPage />,
    },
  ],
};
