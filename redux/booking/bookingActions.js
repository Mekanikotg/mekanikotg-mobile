import {
  SET_CURRENT_BOOKING,
} from "./bookingTypes";


export const setActiveBooking = (data) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_BOOKING,
    payload: data,
  });
};