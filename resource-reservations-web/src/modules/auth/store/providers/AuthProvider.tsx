import { useReducer } from "react";
import { AuthContext } from "../context/AuthContext";
import { authReducer, authReducerInitState } from "../reducers/auth.reducer";

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(authReducer, authReducerInitState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
