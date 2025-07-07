import {
  SET_MODIFY_DONE,
  SET_SELECTED_TOWING,
  SET_TOWING_LIST
} from "./towingTypes";

const initialState = {
  selected_towing: null,
  towing_list: [],
  modify_done: false
};

const towingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_TOWING:
      return {
        ...state,
        selected_towing: action.payload,
      };
    case SET_TOWING_LIST:
      return {
        ...state,
        towing_list: action.payload,
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
export default towingReducer;
