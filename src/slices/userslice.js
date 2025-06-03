import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: localStorage.getItem("login") ? JSON.parse(localStorage.getItem("login")) :  0,
  },
  reducers: {
    userLoginInfo: (state,action) => {
      state.value = action.payload;
      console.log(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { userLoginInfo } = userSlice.actions;

export default userSlice.reducer;
