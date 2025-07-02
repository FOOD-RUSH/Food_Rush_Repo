import { useSelector, useDispatch } from 'react-redux';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { RootState, AppDispatch } from '@/store';
import { saveTheme, selectThemeMode, getActualTheme } from '@/store/slices/themeSlice';
import { ThemeMode } from '@/config/theme';

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => selectThemeMode(state));
  const paperTheme = usePaperTheme();
  
  const actualTheme = getActualTheme(themeMode);

  const setTheme = (mode: ThemeMode) => {
    dispatch(saveTheme(mode));
  };

  return {
    theme: paperTheme,
    themeMode,
    actualTheme,
    setTheme,
    isDark: actualTheme === 'dark',
  };
};