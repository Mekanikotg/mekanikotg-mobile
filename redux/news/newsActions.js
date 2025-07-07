import {
  SET_SELECTED_NEWS, 
  SET_NEWS_LIST,
  SET_MODIFY_DONE
} from "./newsTypes";

export const setSelectedNews = (data) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_NEWS,
    payload: data,
  });
};

export const setNewsList = (data) => (dispatch) => {
  dispatch({
    type: SET_NEWS_LIST,
    payload: data,
  });
};

export const setNewsModifyDone = (data) => (dispatch) => {
  dispatch({
    type: SET_MODIFY_DONE,
    payload: data,
  });
};