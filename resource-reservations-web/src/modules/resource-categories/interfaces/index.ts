export interface ResourceCategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type ResourceCategoryForm = Pick<
  ResourceCategory,
  "name" | "description"
>;

export interface SearchResourceCategoriesBy {
  term?: string;
  isActive?: "true" | "false";
  page?: number;
  limit?: number;
}

export interface SearchResourceCategoriesResponse {
  data: ResourceCategory[];
  count: number;
}
