export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  role?: {
    id: string;
    name: string;
  };
}

export type UserForm = Pick<UserData, "name" | "email" | "phone"> & {
  password: string;
  roleId: string;
};

export type EditUserForm = Omit<UserForm, 'password'> 

export interface SearchUsersBy {
  term?: string;
  isActive?: "true" | "false";
  roleId?: string;
  page?: number;
  limit?: number;
}

export interface SearchUsersResponse {
  data: UserData[];
  count: number;
}
