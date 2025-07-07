import {
  SET_MODIFY_DONE,
  SET_SELECTED_NEWS,
  SET_NEWS_LIST
} from "./newsTypes";

const initialState = {
  selected_news: null,
  news_list: [],
  modify_done: false
};

const newsReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_NEWS:
      return {
        ...state,
        selected_news: action.payload,
      };
    case SET_NEWS_LIST:
      return {
        ...state,
        news_list: action.payload,
      };
    case SET_MODIFY_DONE:
      return {
        ...state,
        modify_done: action.payload
      }
    default:
      return state;
  }
};
export default newsReducers;
