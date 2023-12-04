import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./src/slices/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./src/slices/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
