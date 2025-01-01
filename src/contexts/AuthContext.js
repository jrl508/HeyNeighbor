import React, { createContext, useEffect, useReducer } from "react";
import { jwtDecode } from "jwt-decode";
import authReducer from "../reducers/authReducer";
import { GET_USER, GET_USER_FAILURE, GET_USER_SUCCESS } from "../actionTypes";

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
    const decodedToken = jwtDecode(t);
    const { userId } = decodedToken;
    try {
      dispatch({ type: GET_USER });
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${t}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: GET_USER_SUCCESS,
          payload: { isAuthenticated: true, user: data },
        });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: GET_USER_FAILURE, payload: err });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && !state.user) {
      getUser(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
