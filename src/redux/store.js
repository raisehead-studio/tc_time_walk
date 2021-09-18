import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../redux/user";
import eventReducer from "../redux/events";

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventReducer,
  },
});
