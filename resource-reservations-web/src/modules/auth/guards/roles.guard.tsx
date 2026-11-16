import { Navigate } from "react-router";
import type { AppRole } from "../consts";
import { useAuth } from "../store/hooks/useAuth";

interface Props {
  roles: AppRole[];
  children: React.ReactNode;
  fallback?: string;
}

export const RolesGuard = ({ roles, children, fallback = "/home" }: Props) => {
  const { authenticatedUser } = useAuth();

  if (!authenticatedUser) return <Navigate to="/auth/login" replace />;

  if (!roles.some((role) => role === authenticatedUser.roleName)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};
