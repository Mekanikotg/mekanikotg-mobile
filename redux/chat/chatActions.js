import {
  SET_CHAT_LIST,
} from "./chatTypes";


export const setChatList = (data) => (dispatch) => {
  dispatch({
    type: SET_CHAT_LIST,
    payload: data,
  });
};
