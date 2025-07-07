import {
  SET_CURRENT_BOOKING
} from "./bookingTypes";

const initialState = {
  current_booking: null,
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_BOOKING:
      return {
        ...state,
        current_booking: action.payload,
      };
    default:
      return state;
  }
};
export default bookingReducer;
