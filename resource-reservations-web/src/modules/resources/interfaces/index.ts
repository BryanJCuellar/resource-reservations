import type { ResourceCategory } from "../../resource-categories/interfaces";

export interface Resource {
  id: string;
  name: string;
  code: string;
  description: string | null;
  resourceCategory?: ResourceCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface ResourceForm {
  name: string;
  code: string;
  description: string | null;
  resourceCategoryId: string;
}

export interface SearchResourcesBy {
  term?: string;
  isActive?: "true" | "false";
  resourceCategoryId?: string;
  page?: number;
  limit?: number;
}

export interface SearchResourcesResponse {
  data: Resource[];
  count: number;
}
