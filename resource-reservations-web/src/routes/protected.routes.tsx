import { Navigate } from "react-router";
import { useAuth } from "../modules/auth/store/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoutes = ({ children }: Props) => {
  const { status } = useAuth();

  if (status === "NOT_AUTHENTICATED")
    return <Navigate to="/auth/login" replace />;

  return children;
};
