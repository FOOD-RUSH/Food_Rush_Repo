import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "@/types";


const initialState: AppState = {
  isOnboardingComplete: false,
  language: 'en',

};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.isOnboardingComplete = action.payload;
    },

    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    skipOnboarding: (state) => {
      state.isOnboardingComplete = true;
    },


  },
});

export const { setOnboardingComplete, setLanguage, skipOnboarding } = appSlice.actions;
export default appSlice.reducer;