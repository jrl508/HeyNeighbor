import React, { createContext, useEffect, useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import authReducer from "../reducers/authReducer";
import {
  GET_USER,
  GET_USER_FAILURE,
  GET_USER_SUCCESS,
  LOGOUT,
} from "../actionTypes";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const getUser = async (t) => {
    try {
      const decodedToken = jwtDecode(t);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        dispatch({ type: LOGOUT });
        return;
      }

      const { userId } = decodedToken;
      if (!userId || state.user) return;

      dispatch({ type: GET_USER });

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      dispatch({
        type: GET_USER_SUCCESS,
        payload: { isAuthenticated: true, user: data },
      });
    } catch (err) {
      console.error("Auth rehydration error:", err);
      dispatch({ type: GET_USER_FAILURE, payload: err });
      localStorage.removeItem("token"); // clean up
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !state.user) {
      getUser(token);
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ state, dispatch, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};
