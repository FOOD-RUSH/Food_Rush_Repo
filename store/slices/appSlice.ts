import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "@/types";

const initialState: AppState = {
  isOnboardingComplete: false,
  theme: 'light',
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
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
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

export const { setOnboardingComplete, setTheme, setLanguage, skipOnboarding } = appSlice.actions;
export default appSlice.reducer;