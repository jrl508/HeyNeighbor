import {
  ADD_TOOL,
  ADD_TOOL_FAIL,
  ADD_TOOL_SUCCESS,
  GET_TOOLS,
  GET_TOOLS_FAIL,
  GET_TOOLS_SUCCESS,
  UPDATE_TOOL,
  UPDATE_TOOL_FAIL,
  UPDATE_TOOL_SUCCESS,
  DELETE_TOOL,
  DELETE_TOOL_FAIL,
  DELETE_TOOL_SUCCESS,
} from "../actionTypes";

const toolReducer = (state, action) => {
  switch (action.type) {
    case ADD_TOOL:
    case GET_TOOLS:
    case UPDATE_TOOL:
    case DELETE_TOOL:
      return { ...state, loading: true, errors: null };
    case GET_TOOLS_SUCCESS:
      return { ...state, tools: action.payload, loading: false };
    case ADD_TOOL_SUCCESS:
      return { ...state, tools: [action.payload, ...state.tools] };
    case UPDATE_TOOL_SUCCESS:
      return {
        ...state,
        tools: state.tools.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case DELETE_TOOL_SUCCESS:
      return {
        ...state,
        tools: state.tools.filter((t) => t.id !== action.payload),
      };
    case ADD_TOOL_FAIL:
    case UPDATE_TOOL_FAIL:
    case DELETE_TOOL_FAIL:
    case GET_TOOLS_FAIL:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export default toolReducer;
