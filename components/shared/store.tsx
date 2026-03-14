import { configureStore } from "@reduxjs/toolkit";

import boatSlice from "features/boat/boatSlice";
import cardSlice from "features/card/cardSlice";
import bookmarkSlice from "features/bookmark/bookmarkSlice";
import filterReducer from "features/filters/filterSlice";

export const store = configureStore({
  reducer: {
    boat: boatSlice,
    card: cardSlice,
    bookmark: bookmarkSlice,
    filters: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
