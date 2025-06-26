import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "@/types";

const initialState: AppState = {
  isOnboardingComplete: false,
  language: 'en',
  currentOnboardingStep: 0,

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
      state.currentOnboardingStep = 0;
    },
    setCurrentOnboardingStep: (state, action: PayloadAction<number>) => {
      state.currentOnboardingStep = action.payload;
    },
   
  },
});

export const { setOnboardingComplete, setLanguage, skipOnboarding } = appSlice.actions;
export default appSlice.reducer;