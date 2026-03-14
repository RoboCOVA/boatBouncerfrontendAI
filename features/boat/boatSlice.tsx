import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  boatInfo: {
    title: "",
    boatType: "",
    activityType: "",
    description: "",
    manufacturer: "",
    minPeople: "",
    discount: "",
    model: "",
    year: "",
    length: "",
    perPerson: "",
    maxPassengers: "",
    captained: false,
    amenities: [],
    imageUrls: [],
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    latLng: {
      latitude: null,
      longitude: null,
    },
    features: [],
    pricing: {},
    currency: "USD",
    cancelationPolicy: [{ refund: "", priorHours: "" }],
    securityAllowance: "",
    perHourPrice: "",
    perDayPrice: "",
    hours: "",
    days: "",
    hourlyDiscount: "",
    dailyDiscount: "",
  },
  editableBoat: null,
  bookmarks: null,
  boats: [],
};

export const boatSlice = createSlice({
  name: "Boat",
  initialState,
  reducers: {
    updateBasicInfoField: (state: any, { payload: { key, value } }) => {
      state.boatInfo[key] = value;
    },
    updateLocationField: (state: any, { payload: { key, value } }) => {
      state.boatInfo.location[key] = value;
    },
    updateCoordinateField: (state: any, { payload: value }) => {
      state.boatInfo.latLng = value;
    },
    updateFeaturesList: (state, { payload: { key, value } }) => {
      if (value) {
        state.boatInfo.features = [...state.boatInfo.features, key];
      } else {
        let filteredState = state.boatInfo.features.filter(
          (val: string) => val !== key,
        );
        state.boatInfo.features = filteredState;
      }
    },
    updateCategory: (state: any, { payload: value }) => {
      state.boatInfo.category = value;
    },
    updateAmenitiesList: (state: any, { payload: { key, value } }) => {
      if (value) {
        state.boatInfo.amenities = [...state.boatInfo.amenities, key];
      } else {
        let filteredState = state.boatInfo.amenities.filter(
          (val: string) => val !== key,
        );
        state.boatInfo.amenities = filteredState;
      }
    },
    updateCaptainedList: (state: any, { payload: { key, value } }) => {
      state.boatInfo.captained = value;
    },
    updateSecurityAllowance: (state: any, { payload: value }) => {
      state.boatInfo.securityAllowance = value;
    },
    updateImageUrls: (state: any, { payload: { key, imageUrl } }) => {
      let updatedImageUrls = state.boatInfo.imageUrls.filter(
        (url: string) => url,
      );
      state.boatInfo.imageUrls = [...updatedImageUrls, ...imageUrl];
    },
    deleteImageUrl: (state: any, { payload: { key } }) => {
      let updatedImageUrls = state.boatInfo.imageUrls;
      updatedImageUrls.splice(key, 1);
      state.boatInfo.imageUrls = updatedImageUrls;
    },
    makeCoverPhoto: (state: any, { payload: { key } }) => {
      let imageUrls = state.boatInfo.imageUrls;
      [imageUrls[0], imageUrls[key]] = [imageUrls[key], imageUrls[0]];

      state.boatInfo.imageUrls = imageUrls;
    },
    updateSubCategory: (state: any, { payload: value }) => {
      state.boatInfo.subCategory = value;
    },
    updatePerPerson: (state: any, { payload: value }) => {
      state.boatInfo.perPerson = value;
    },
    resetSubCategories: (state) => {
      state.boatInfo.subCategory = "";
    },
    setBoatInfo: (state, { payload: boatInfo }) => {
      state.boatInfo = boatInfo;
    },
    setEditableBoat: (state: any, { payload: boatInfo }) => {
      state.editableBoat = boatInfo;
    },
    resetBoat: (state) => {
      state.boatInfo = initialState.boatInfo;
      state.editableBoat = initialState.editableBoat;
    },
    setBookmarks: (state, { payload: bookmarks }) => {
      state.bookmarks = bookmarks;
    },
    resetBookmarks: (state) => {
      state.bookmarks = initialState.bookmarks;
    },
    updateCurrency: (state, { payload: currency }) => {
      state.boatInfo.currency = currency;
    },
    updatePricing: (state, { payload }) => {
      state.boatInfo.pricing = [payload];
    },
    setBoats: (state, { payload: boats }) => {
      state.boats = boats;
    },
    updateCancellationPolicy: (state, { payload: { cancellationPolicy } }) => {
      state.boatInfo.cancelationPolicy = cancellationPolicy;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateBasicInfoField,
  updateLocationField,
  updateCoordinateField,
  updateFeaturesList,
  updateCategory,
  updateAmenitiesList,
  updateImageUrls,
  updateSubCategory,
  updateCurrency,
  resetSubCategories,
  updateCaptainedList,
  setBoatInfo,
  setEditableBoat,
  resetBoat,
  setBookmarks,
  resetBookmarks,
  updatePricing,
  updateSecurityAllowance,
  updateCancellationPolicy,
  setBoats,
  updatePerPerson,
  deleteImageUrl,
  makeCoverPhoto,
} = boatSlice.actions;

export default boatSlice.reducer;
