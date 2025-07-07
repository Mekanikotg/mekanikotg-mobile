import {
  SET_MODIFY_DONE,
  SET_SELECTED_MECHANIC,
  SET_MECHANIC_LIST
} from "./mechanicTypes";

const initialState = {
  selected_mechanic: null,
  mechanic_list: [],
  modify_done: false
};

const mechanicReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_MECHANIC:
      return {
        ...state,
        selected_mechanic: action.payload,
      };
    case SET_MECHANIC_LIST:
      return {
        ...state,
        mechanic_list: action.payload,
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
export default mechanicReducer;
