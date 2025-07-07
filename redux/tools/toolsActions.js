import {
  SET_TOOLS_LIST,
} from "./toolsTypes";


export const setToolsList = (data) => (dispatch) => {
  dispatch({
    type: SET_TOOLS_LIST,
    payload: data,
  });
};

