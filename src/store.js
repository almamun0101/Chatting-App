import { configureStore } from "@reduxjs/toolkit";
import  userSlice  from "./slices/userslice";

export default configureStore({
  reducer: {
    userLogin: userSlice,
  },
});
