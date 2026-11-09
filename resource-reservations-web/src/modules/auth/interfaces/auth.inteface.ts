export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  roleName: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthenticatedUser;
}
