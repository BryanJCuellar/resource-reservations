export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  roleName: string;
}
