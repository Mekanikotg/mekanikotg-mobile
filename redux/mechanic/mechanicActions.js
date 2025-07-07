import {
  SET_SELECTED_MECHANIC, 
  SET_MECHANIC_LIST,
  SET_MODIFY_DONE
} from "./mechanicTypes";

export const setSelectedMechanic = (data) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_MECHANIC,
    payload: data,
  });
};

export const setMechanicList = (data) => (dispatch) => {
  dispatch({
    type: SET_MECHANIC_LIST,
    payload: data,
  });
};

export const setMechanicModifyDone = (data) => (dispatch) => {
  dispatch({
    type: SET_MODIFY_DONE,
    payload: data,
  });
};