import {
  SET_CREDENTIALS,
  SET_SELECTED_USER,
  SET_USER_LIST,
  SET_MODIFY_DONE,
  SET_PROVIDER_DETAILS
} from "./userTypes";

const initialState = {
  credentials: null,
  provider_details: null,
  selected_user: null,
  user_list: [],
  modify_done: false
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CREDENTIALS:
      return {
        ...state,
        credentials: action.payload,
      };
    case SET_SELECTED_USER:
      return {
        ...state,
        selected_user: action.payload,
      };
    case SET_USER_LIST:
      return {
        ...state,
        user_list: action.payload,
      };
    case SET_MODIFY_DONE:
      return {
        ...state,
        modify_done: action.payload
      }
    case SET_PROVIDER_DETAILS:
      return {
        ...state,
        provider_details: action.payload
      }
    default:
      return state;
  }
};
export default productReducer;
