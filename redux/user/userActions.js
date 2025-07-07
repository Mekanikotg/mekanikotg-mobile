import {
  SET_CREDENTIALS,
  SET_SELECTED_USER,
  SET_USER_LIST,
  SET_MODIFY_DONE,
  SET_PROVIDER_DETAILS
} from "./userTypes";

export const setUserCredentials = (data) => (dispatch) => {
  dispatch({
    type: SET_CREDENTIALS,
    payload: data,
  });
};

export const setSelectedUser = (data) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_USER,
    payload: data,
  });
};

export const setUserList = (data) => (dispatch) => {
  dispatch({
    type: SET_USER_LIST,
    payload: data,
  });
};

export const setUserModifyDone = (data) => (dispatch) => {
  dispatch({
    type: SET_MODIFY_DONE,
    payload: data,
  });
};

export const setUserProviderDetails = (data) => (dispatch) => {
  dispatch({
    type: SET_PROVIDER_DETAILS,
    payload: data,
  });
};

