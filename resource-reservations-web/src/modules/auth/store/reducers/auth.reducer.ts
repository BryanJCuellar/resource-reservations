import type { AuthAction, AuthState } from "../interfaces";

export const authReducerInitState: AuthState = {
  status: "CHECKING",
  authenticatedUser: null,
};

export const authReducer = (
  state: AuthState = authReducerInitState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case "CHECKING":
      return { ...state, status: "CHECKING", authenticatedUser: null };

    case "LOGIN":
      return {
        ...state,
        status: "AUTHENTICATED",
        authenticatedUser: action.payload.user,
      };

    case "LOGOUT":
      return { ...state, status: "NOT_AUTHENTICATED", authenticatedUser: null };

    default:
      return state;
  }
};
