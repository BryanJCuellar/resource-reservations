import type { AppRole } from "../../modules/auth/consts";

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: AppRole[];
  group?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
