import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, firstName: null, lastName: null },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, firstName, lastName } = action.payload;
      state.token = accessToken;
      state.firstName = firstName;
      state.lastName = lastName;
    },
    logOut: (state, action) => {
      state.token = null;
      state.firstName = null;
      state.lastName = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentFirstName = (state) => state.auth.firstName;
export const selectCurrentLastName = (state) => state.auth.lastName;
