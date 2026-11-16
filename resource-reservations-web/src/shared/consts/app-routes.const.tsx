import {
  Boxes,
  CalendarDays,
  CalendarPlus,
  House,
  Shapes,
  Users,
  UserShield,
} from "lucide-react";
import type { NavItem } from "../interfaces";
import { UserRoles } from "../../modules/auth/consts";

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/home",
    label: "Inicio",
    icon: <House className="h-5 w-5" />,
  },
  {
    to: "/book",
    label: "Hacer una reserva",
    icon: <CalendarPlus className="h-5 w-5" />,
    roles: [UserRoles.CLIENT],
  },
  {
    to: "/my-reservations",
    label: "Mis reservas",
    icon: <CalendarDays className="h-5 w-5" />,
    roles: [UserRoles.CLIENT],
  },
  {
    to: "/reservations",
    label: "Reservas",
    icon: <CalendarDays className="h-5 w-5" />,
    roles: [UserRoles.ADMIN, UserRoles.STAFF],
  },
  {
    to: "/resources",
    label: "Recursos",
    icon: <Boxes className="h-5 w-5" />,
    roles: [UserRoles.STAFF],
  },
  // ============
  // ADMIN
  // ============
  {
    to: "/admin/users",
    label: "Usuarios",
    icon: <Users className="h-5 w-5" />,
    roles: [UserRoles.ADMIN],
    group: "Administración",
  },
  {
    to: "/admin/roles",
    label: "Roles",
    icon: <UserShield className="h-5 w-5" />,
    roles: [UserRoles.ADMIN],
    group: "Administración",
  },
  {
    to: "/admin/resources",
    label: "Recursos",
    icon: <Boxes className="h-5 w-5" />,
    roles: [UserRoles.ADMIN],
    group: "Administración",
  },
  {
    to: "/admin/resource-categories",
    label: "Categorías",
    icon: <Shapes className="h-5 w-5" />,
    roles: [UserRoles.ADMIN],
    group: "Administración",
  },
];

/** Retorna los nav items segun el rol */
export const getNavItemsByRole = (role: string): NavItem[] => {
  const seen = new Set<string>();

  return NAV_ITEMS.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true; // Sin roles definidos = visible para todos los autenticados
    return item.roles.some((allowedRole) => allowedRole === role);
  }).filter((item) => {
    if (seen.has(item.to)) return false;
    seen.add(item.to);
    return true;
  });
};
