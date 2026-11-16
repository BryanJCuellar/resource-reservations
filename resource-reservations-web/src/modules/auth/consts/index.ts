export const UserRoles = {
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  STAFF: "STAFF",
} as const;

export type AppRole = (typeof UserRoles)[keyof typeof UserRoles];
