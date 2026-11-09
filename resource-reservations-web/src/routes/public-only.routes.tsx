import { Navigate } from "react-router";
import { useAuth } from "../modules/auth/store/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export const PublicOnlyRoutes = ({ children }: Props) => {
  const { status } = useAuth();

  if (status === "AUTHENTICATED") return <Navigate to="/home" replace />;

  return children;
};
