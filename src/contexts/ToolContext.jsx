import { createContext, useReducer, useContext } from "react";
import toolReducer from "../reducers/toolReducer";

export const ToolContext = createContext();

const initialState = {
  tools: [],
  loading: null,
  error: null,
  hasFetched: false,
};

export const ToolProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toolReducer, initialState);

  return (
    <ToolContext.Provider value={{ state, dispatch }}>
      {children}
    </ToolContext.Provider>
  );
};
