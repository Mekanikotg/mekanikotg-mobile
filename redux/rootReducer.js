import { combineReducers } from "redux";
import userReducer from "./user/userReducers";
import towingReducer from "./towing/towingReducers";
import mechanicReducer from "./mechanic/mechanicReducers";
import newsReducer from "./news/newsReducers";
import toolsReducers from "./tools/toolsReducers";
import chatReducers from "./chat/chatReducers";
import bookingReducers from "./booking/bookingReducers";


const rootReducer = combineReducers({
  towing: towingReducer,
  user: userReducer,
  mechanic: mechanicReducer,
  news: newsReducer,
  tools: toolsReducers,
  chat: chatReducers,
  booking: bookingReducers
});

export default rootReducer;
