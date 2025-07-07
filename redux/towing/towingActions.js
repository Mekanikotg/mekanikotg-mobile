import {
  SET_SELECTED_TOWING, 
  SET_TOWING_LIST,
  SET_MODIFY_DONE
} from "./towingTypes";

export const setSelectedTowing = (data) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_TOWING,
    payload: data,
  });
};

export const setTowingList = (data) => (dispatch) => {
  dispatch({
    type: SET_TOWING_LIST,
    payload: data,
  });
};

export const setTowingModifyDone = (data) => (dispatch) => {
  dispatch({
    type: SET_MODIFY_DONE,
    payload: data,
  });
};