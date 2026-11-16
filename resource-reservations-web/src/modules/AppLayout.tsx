import {
  Boxes,
  CalendarDays,
  House,
  Laptop,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { useState } from "react";
import { useAuth } from "./auth/store/hooks/useAuth";
import { useTheme } from "../shared/store/hooks/useTheme";
import { getNavItemsByRole } from "../shared/consts";
import type { NavGroup, NavItem } from "../shared/interfaces";
import { getInitials, getRoleName } from "../shared/utils";

const logoUrl = "/locenda-logo.svg";

export const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const { theme, setTheme } = useTheme();
  const { authenticatedUser, logout } = useAuth();

  if (!authenticatedUser) return null;

  const navItems: NavItem[] = getNavItemsByRole(authenticatedUser.roleName);

  const navGroups: NavGroup[] = navItems.reduce<NavGroup[]>(
    (groups, item) => {
      // Los items que no tienen un grupo definido se listan primero
      if (!item.group) {
        groups[0].items.push(item);
        return groups;
      }

      const groupIndex = groups.findIndex(
        (group) => group.title === item.group,
      );

      if (groupIndex !== -1) {
        groups[groupIndex].items.push(item);
      } else {
        groups.push({
          title: item.group,
          items: [item],
        });
      }

      return groups;
    },
    [{ title: "", items: [] }],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-blue-950 dark:bg-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed md:hidden inset-0 bg-black/60 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <aside
          id="mobile-navigation"
          aria-label="Navegación móvil"
          className="fixed flex flex-col md:hidden inset-y-0 left-0 w-64 z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm px-3 py-4 gap-8 overflow-y-auto"
        >
          <div>
            <div className="text-right mb-3">
              <button
                type="button"
                aria-label="Cerrar navegación"
                className="inline-flex h-11 w-11 items-center justify-center text-slate-600 rounded-md hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Logo */}
            <div className="flex justify-center items-center gap-3">
              <img
                src={logoUrl}
                alt="Locenda"
                className="h-auto w-10 shrink-0"
              />
              <span className="text-lg font-semibold tracking-tight">
                Locenda
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 justify-between gap-8">
            <nav
              aria-label="Navegación principal"
              className="flex flex-col gap-6"
            >
              {navGroups.map((group) => (
                <div key={group.title}>
                  {group.title && (
                    <p className="mb-2 px-4 text-sm font-semibold text-blue-950 dark:text-slate-100">
                      {group.title}
                    </p>
                  )}
                  <ul className="flex flex-col gap-1">
                    {group.items.map((item) => (
                      <li>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `flex justify-start items-center gap-3 px-4 py-3 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300 ${isActive ? "text-blue-700 bg-blue-100 font-semibold dark:text-blue-300 dark:bg-blue-950" : "text-slate-600 hover:text-blue-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700"}`
                          }
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {/* <ul className="flex flex-col gap-1">
                <li>
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      `flex justify-start items-center gap-3 px-4 py-3 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300 ${isActive ? "text-blue-700 bg-blue-100 font-semibold dark:text-blue-300 dark:bg-blue-950" : "text-slate-600 hover:text-blue-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700"}`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <House className="h-5 w-5" />
                    <span>Inicio</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/not-found"
                    className={({ isActive }) =>
                      `flex justify-start items-center gap-3 px-4 py-3 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300 ${isActive ? "text-blue-700 bg-blue-100 font-semibold dark:text-blue-300 dark:bg-blue-950" : "text-slate-600 hover:text-blue-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700"}`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Boxes className="h-5 w-5" />
                    <span>Recursos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/not-found"
                    className={({ isActive }) =>
                      `flex justify-start items-center gap-3 px-4 py-3 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300 ${isActive ? "text-blue-700 bg-blue-100 font-semibold dark:text-blue-300 dark:bg-blue-950" : "text-slate-600 hover:text-blue-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700"}`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <CalendarDays className="h-5 w-5" />
                    <span>Mis reservas</span>
                  </NavLink>
                </li>
              </ul> */}
            </nav>
            <ul className="flex flex-col gap-1 border-t border-slate-200 pt-4 dark:border-slate-700">
              <li className="flex items-center gap-3 px-4 pb-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  {getInitials(authenticatedUser.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{authenticatedUser.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {getRoleName(authenticatedUser.roleName)}
                  </p>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  disabled
                  className="flex min-h-11 w-full items-center gap-3 rounded-md px-4 py-3 text-sm text-slate-500 dark:text-slate-400"
                >
                  <User className="h-5 w-5" aria-hidden="true" /> Mi perfil{" "}
                  <span className="ml-auto text-xs">Pendiente</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  disabled
                  className="flex min-h-11 w-full items-center gap-3 rounded-md px-4 py-3 text-sm text-slate-500 dark:text-slate-400"
                >
                  <Settings className="h-5 w-5" aria-hidden="true" />{" "}
                  Configuración{" "}
                  <span className="ml-auto text-xs">Pendiente</span>
                </button>
              </li>
              <li className="w-full">
                <button
                  type="button"
                  className="w-full flex justify-start items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-slate-600 hover:text-blue-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300"
                  onClick={logout}
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </aside>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shrink-0 px-3 py-6 gap-10 h-dvh sticky top-0 overflow-hidden">
        {/* Logo */}
        <div className="flex justify-center items-center gap-3 shrink-0">
          <img src={logoUrl} alt="Locenda" className="h-auto w-12 shrink-0" />
          <span className="text-2xl font-semibold tracking-tight">Locenda</span>
        </div>
        <div className="flex min-h-0 flex-col flex-1 gap-8">
          <nav
            aria-label="Navegación principal"
            className="scrollbar-custom flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain scroll-py-4 p-1.5"
          >
            {navGroups.map((group) => (
              <div key={group.title} className="shrink-0">
                {group.title && (
                  <p className="mb-2 px-4 text-sm font-semibold text-blue-950 dark:text-slate-100">
                    {group.title}
                  </p>
                )}
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `flex justify-start items-center gap-3 px-4 py-3 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300 ${isActive ? "text-blue-700 bg-blue-100 font-semibold dark:text-blue-300 dark:bg-blue-950" : "text-slate-600 hover:text-blue-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700"}`
                        }
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <ul className="flex shrink-0 flex-col gap-1">
            <li className="w-full">
              <button
                type="button"
                className="w-full flex justify-start items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-slate-600 hover:text-blue-950 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Navbar + Content */}
      <div className="flex min-w-0 flex-col flex-1">
        <nav className="flex justify-between items-center gap-4 px-4 md:px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          {/* Logo Mobile */}
          <div className="flex md:hidden justify-center items-center gap-3">
            <img src={logoUrl} alt="Locenda" className="h-auto w-10 shrink-0" />
            <span className="text-lg font-semibold tracking-tight">
              Locenda
            </span>
          </div>
          {/* Desktop View */}
          <div className="hidden md:flex gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Espacio de trabajo
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">/</p>
            <p className="text-sm font-medium text-blue-950 dark:text-slate-100">
              Inicio
            </p>
          </div>
          <div
            className="group relative hidden md:block"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button
              type="button"
              aria-label={`Abrir cuenta de ${authenticatedUser.name}`}
              aria-controls="desktop-account"
              className="flex h-11 w-13 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              >
                {getInitials(authenticatedUser.name)}
              </span>
            </button>
            {isMenuOpen && (
              <div
                id="desktop-account"
                className="absolute right-0 top-full z-30 w-72 max-w-[calc(100vw-2rem)] pt-2"
              >
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex flex-col gap-1 border-b border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-sm font-semibold">{authenticatedUser.name}</p>
                    <p className="break-all text-sm text-slate-600 dark:text-slate-300">
                      {authenticatedUser.email}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {getRoleName(authenticatedUser.roleName)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 p-2">
                    <button
                      type="button"
                      disabled
                      className="flex min-h-11 items-center gap-3 rounded-md px-3 py-3 text-sm text-slate-500 dark:text-slate-400"
                    >
                      <User className="h-5 w-5" aria-hidden="true" /> Mi perfil{" "}
                      <span className="ml-auto text-xs">Pendiente</span>
                    </button>
                    <button
                      type="button"
                      disabled
                      className="flex min-h-11 items-center gap-3 rounded-md px-3 py-3 text-sm text-slate-500 dark:text-slate-400"
                    >
                      <Settings className="h-5 w-5" aria-hidden="true" />{" "}
                      Configuración{" "}
                      <span className="ml-auto text-xs">Pendiente</span>
                    </button>
                    <div className="flex items-center gap-3 p-2">
                      <p className="px-1 text-sm text-slate-500 dark:text-slate-400">
                        Tema
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={`${theme === "LIGHT" ? "bg-slate-200 dark:bg-slate-700" : ""} hover:bg-slate-200 text-slate-500 dark:text-slate-400 p-3 rounded-md border border-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-100`}
                          onClick={() => setTheme("LIGHT")}
                        >
                          <Sun className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className={`${theme === "DARK" ? "bg-slate-200 dark:bg-slate-700" : ""} hover:bg-slate-200 text-slate-500 dark:text-slate-400 p-3 rounded-md border border-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-100`}
                          onClick={() => setTheme("DARK")}
                        >
                          <Moon className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className={`${theme === "SYSTEM" ? "bg-slate-200 dark:bg-slate-700" : ""} hover:bg-slate-200 text-slate-500 dark:text-slate-400 p-3 rounded-md border border-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-100`}
                          onClick={() => setTheme("SYSTEM")}
                        >
                          <Laptop className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 p-2 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={logout}
                      className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300"
                    >
                      <LogOut className="h-5 w-5" aria-hidden="true" /> Cerrar
                      sesión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Mobile View */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              aria-label="Abrir navegación"
              aria-controls="mobile-navigation"
              aria-expanded={isSidebarOpen}
              className="inline-flex h-11 w-11 items-center justify-center text-slate-600 rounded-md hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-300"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
        <main className="flex-1 p-4 md:p-6">
          <Outlet></Outlet>
        </main>
      </div>
    </div>
  );
};
