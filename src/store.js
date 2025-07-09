import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userslice";
import chatSlice from "./slices/chatSlice";

export default configureStore({
  reducer: {
    userLogin: userSlice,
    chatInfo : chatSlice,
  },
});
