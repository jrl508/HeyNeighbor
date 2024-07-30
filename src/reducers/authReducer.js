import {
  LOGIN,
  LOGOUT,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
} from "../actionTypes";

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      return { ...state, isAuthenticated: false, user: null };

    case REGISTER:
      return { ...state, loading: true };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_USER:
      return { ...state, loading: true };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          ...action.payload,
        },
        error: null,
      };
    case UPDATE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_USER:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
