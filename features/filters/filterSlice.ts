import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  priceRange: { min: string; max: string };
  dates: { start: string; end: string };
  listingType: string;
  boatType: string[];
  maxPassengers: string;
  amenities: string[];
  activityType: string[];
  bbox: string;
}

const initialState: FilterState = {
  priceRange: { min: "", max: "" },
  dates: { start: "", end: "" },
  listingType: "",
  boatType: [],
  maxPassengers: "",
  amenities: [],
  activityType: [],
  bbox: "",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setPriceRange(state, action: PayloadAction<{ min: string; max: string }>) {
      state.priceRange = action.payload;
    },
    setDates(state, action: PayloadAction<{ start: string; end: string }>) {
      state.dates = action.payload;
    },
    setListingType(state, action: PayloadAction<string>) {
      state.listingType = action.payload;
    },
    setBoatType(state, action: PayloadAction<string[]>) {
      state.boatType = action.payload;
    },
    setMaxPassengers(state, action: PayloadAction<string>) {
      state.maxPassengers = action.payload;
    },
    setAmenities(state, action: PayloadAction<string[]>) {
      state.amenities = action.payload;
    },
    setActivityType(state, action: PayloadAction<string[]>) {
      state.activityType = action.payload;
    },
    setbbox(state, action: PayloadAction<string>) {
      state.bbox = action.payload;
    },
    resetFilters(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setPriceRange,
  setDates,
  setListingType,
  setBoatType,
  setMaxPassengers,
  setAmenities,
  setActivityType,
  resetFilters,
  setbbox,
} = filterSlice.actions;

export default filterSlice.reducer;
