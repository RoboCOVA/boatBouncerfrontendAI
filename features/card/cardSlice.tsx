import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cardInfo: {
    "Account Name": "",
    "Account Type": "",
    "Account Number": "",
    "Routing Number": "",
    "Street Address": "",
    State: "",
    "Street Address 2": "",
    City: "",
    "Zip/postal code": "",
    CVC: "",
    "Expiration Date": "",
  },
};

export const cardSlice = createSlice({
  name: "Card",
  initialState,
  reducers: {
    updateCard: (state: any, { payload: { key, value } }) => {
      state.cardInfo[key] = value;
    },
    resetCard: (state) => {
      state.cardInfo = initialState.cardInfo;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateCard, resetCard } = cardSlice.actions;

export default cardSlice.reducer;
