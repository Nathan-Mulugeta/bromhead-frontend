import { createSlice } from "@reduxjs/toolkit";

const loading = createSlice({
  name: "loading",
  initialState: false,
  reducers: {
    setLoading: (state, action) => {
      return action.payload;
    },
  },
});

export const { setLoading } = loading.actions;

export default loading.reducer;

export const selectCurrentLoading = (state) => state.loading;
