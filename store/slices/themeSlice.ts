import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { ThemeState, ThemeMode } from "@/config/theme";
const THEME_STORAGE_KEY= '@app_theme';

// async thunk to load theme from async storage

export const loadTheme = createAsyncThunk(
    'theme/loadTheme',
    async (): Promise <ThemeMode> => {
        try
        {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme))
            {
                return savedTheme as ThemeMode;
            }
            return 'system'
        }
        catch (error)
        {
            console.log('Error loading theme: ', error);
            return 'system'
        }
    }

)
// async thunk to load theme from async storage

export const saveTheme = createAsyncThunk (
    'theme/saveTheme',
     async (theme: ThemeMode): Promise<ThemeMode> => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      return theme;
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  }
);

const initialState: ThemeState = {
    mode: 'system',
    isLoading: true
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
        state.isLoading = false;
      })
      .addCase(loadTheme.rejected, (state) => {
        state.mode = 'system';
        state.isLoading = false;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
      });
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;

// Selector to get current theme mode
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;
export const selectThemeLoading = (state: { theme: ThemeState }) => state.theme.isLoading;

// Helper function to get actual theme based on mode
export const getActualTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return mode;
};

