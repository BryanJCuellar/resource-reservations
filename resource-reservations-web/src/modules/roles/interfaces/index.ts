export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export type RoleForm = Pick<Role, "name">;

export interface SearchRolesBy {
  term?: string;
  isActive?: "true" | "false";
  page?: number;
  limit?: number;
}

export interface SearchRolesResponse {
  data: Role[];
  count: number;
}
