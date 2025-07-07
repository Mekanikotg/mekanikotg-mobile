import {
  SET_CHAT_LIST
} from "./chatTypes";

const initialState = {
  chat_list: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_CHAT_LIST:
      return {
        ...state,
        chat_list: action.payload,
      };

    default:
      return state;
  }
};
export default chatReducer;
