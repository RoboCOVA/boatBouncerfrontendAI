import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookmarkInfo: {
    id: null,
    cancelId: null,
    boatId: null,
    defaultId: null,
    target: null,
  },
};

export const bookmarkSlice = createSlice({
  name: "Bookmark",
  initialState,
  reducers: {
    setActiveId: (state: any, { payload: id }) => {
      state.bookmarkInfo.id = id;
    },
    resetId: (state) => {
      state.bookmarkInfo.id = initialState.bookmarkInfo.id;
    },
    setCancelledActiveId: (state: any, { payload: id }) => {
      state.bookmarkInfo.cancelId = id;
    },
    resetCancelledId: (state) => {
      state.bookmarkInfo.cancelId = initialState.bookmarkInfo.cancelId;
    },
    setDefaultActiveId: (state: any, { payload: id }) => {
      state.bookmarkInfo.defaultId = id;
    },
    resetDefaultId: (state) => {
      state.bookmarkInfo.defaultId = initialState.bookmarkInfo.defaultId;
    },
    setActiveBoatId: (state: any, { payload: boatId }) => {
      state.bookmarkInfo.boatId = boatId;
    },
    resetBoatId: (state) => {
      state.bookmarkInfo.boatId = initialState.bookmarkInfo.boatId;
    },
    setTarget: (state: any, { payload: target }) => {
      state.bookmarkInfo.target = target;
    },
    resetTarget: (state) => {
      state.bookmarkInfo.target = initialState.bookmarkInfo.target;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setActiveId,
  setCancelledActiveId,
  resetCancelledId,
  resetId,
  setActiveBoatId,
  resetBoatId,
  setDefaultActiveId,
  resetDefaultId,
  setTarget,
  resetTarget,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
