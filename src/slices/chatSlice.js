import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    value:null,
  },
  reducers: {
    chattingInfo: (state,action) => {
      state.value = action.payload;
      
    },
  },
});

// Action creators are generated for each case reducer function
export const { chattingInfo } = chatSlice.actions;

export default chatSlice.reducer;
