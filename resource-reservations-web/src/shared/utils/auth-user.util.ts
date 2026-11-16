import { UserRoles } from "../../modules/auth/consts";

export const getInitials = (name: string): string => {
  const trimmedName = name.trim();
  if (!trimmedName) return "";

  const words = trimmedName.split(/\s+/);
  const firstInitial = words[0][0];
  const lastInitial = words.length > 1 ? words[words.length - 1][0] : "";

  return (firstInitial + lastInitial).toUpperCase();
};

export const getRoleName = (roleName: string): string => {
  if (roleName === UserRoles.ADMIN) return "Administrador";
  if (roleName === UserRoles.STAFF) return "Staff";
  if (roleName === UserRoles.CLIENT) return "Cliente";
  return roleName;
};
