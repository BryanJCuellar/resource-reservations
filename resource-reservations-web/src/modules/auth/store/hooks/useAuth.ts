import { useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAuthUser, login } from "../../services/auth.service";
import { isAxiosError } from "axios";
import { STORAGE_KEYS } from "../../../../shared/consts";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { state, dispatch } = context;
  const { status, authenticatedUser } = state;

  const handleLogin = async (email: string, password: string) => {
    const data = await login(email, password);
    localStorage.setItem(STORAGE_KEYS.accessToken, data.accessToken);
    dispatch({ type: "LOGIN", payload: { user: data.user } });
    return data;
  };

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    dispatch({ type: "LOGOUT" });
  }, [dispatch]);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.accessToken);
    if (!token) return dispatch({ type: "LOGOUT" });

    try {
      const user = await getAuthUser();
      dispatch({ type: "LOGIN", payload: { user } });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        logout();
        return;
      }
      throw error;
    }
  }, [dispatch, logout]);

  return {
    // Props
    status,
    authenticatedUser,
    // Methods
    handleLogin,
    logout,
    checkAuth,
  };
};
