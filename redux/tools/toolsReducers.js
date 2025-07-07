import {
  SET_TOOLS_LIST
} from "./toolsTypes";

const initialState = {
  selected_tools: null,
  tools_list: [],
  modify_done: false
};

const agentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TOOLS_LIST:
      return {
        ...state,
        tools_list: action.payload,
      };

    default:
      return state;
  }
};
export default agentReducer;
