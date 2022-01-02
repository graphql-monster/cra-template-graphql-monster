import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import apolloClient from "./apolloClient";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          apolloClient,
        },
      },
    }),
});
