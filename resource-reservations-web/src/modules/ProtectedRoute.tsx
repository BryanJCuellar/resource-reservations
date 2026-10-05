import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem("reserv-access-t");

  return accessToken ? children : <Navigate to="/auth/login" />;
};
