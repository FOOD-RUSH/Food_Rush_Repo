
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  isLoading: boolean;
}
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007aff', // Blue from Cameroon flag
    secondary: '#facc15', // Yellow from Cameroon flag
    tertiary: '#22c55e', // Green representing nature
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#ffffff',
    error: '#ef4444',
    errorContainer: '#fef2f2',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#1e293b',
    onBackground: '#1e293b',
    outline: '#cbd5e1',
  },
  dark: false
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#007aff',
    secondary: '#facc15',
    tertiary: '#22c55e',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    background: '#0f172a',
    error: '#ef4444',
    errorContainer: '#7f1d1d',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#f1f5f9',
    onBackground: '#f1f5f9',
    outline: '#64748b',
  },
  dark: true
};

// dark color theme

// {
//   "colors": {
//     "primary": "rgb(173, 198, 255)",
//     "onPrimary": "rgb(0, 46, 105)",
//     "primaryContainer": "rgb(0, 68, 147)",
//     "onPrimaryContainer": "rgb(216, 226, 255)",
//     "secondary": "rgb(191, 198, 220)",
//     "onSecondary": "rgb(41, 48, 65)",
//     "secondaryContainer": "rgb(63, 71, 89)",
//     "onSecondaryContainer": "rgb(219, 226, 249)",
//     "tertiary": "rgb(222, 188, 223)",
//     "onTertiary": "rgb(64, 40, 67)",
//     "tertiaryContainer": "rgb(88, 62, 91)",
//     "onTertiaryContainer": "rgb(251, 215, 252)",
//     "error": "rgb(255, 180, 171)",
//     "onError": "rgb(105, 0, 5)",
//     "errorContainer": "rgb(147, 0, 10)",
//     "onErrorContainer": "rgb(255, 180, 171)",
//     "background": "rgb(27, 27, 31)",
//     "onBackground": "rgb(227, 226, 230)",
//     "surface": "rgb(27, 27, 31)",
//     "onSurface": "rgb(227, 226, 230)",
//     "surfaceVariant": "rgb(68, 71, 79)",
//     "onSurfaceVariant": "rgb(196, 198, 208)",
//     "outline": "rgb(142, 144, 153)",
//     "outlineVariant": "rgb(68, 71, 79)",
//     "shadow": "rgb(0, 0, 0)",
//     "scrim": "rgb(0, 0, 0)",
//     "inverseSurface": "rgb(227, 226, 230)",
//     "inverseOnSurface": "rgb(48, 48, 51)",
//     "inversePrimary": "rgb(0, 91, 193)",
//     "elevation": {
//       "level0": "transparent",
//       "level1": "rgb(34, 36, 42)",
//       "level2": "rgb(39, 41, 49)",
//       "level3": "rgb(43, 46, 56)",
//       "level4": "rgb(45, 48, 58)",
//       "level5": "rgb(47, 51, 62)"
//     },
//     "surfaceDisabled": "rgba(227, 226, 230, 0.12)",
//     "onSurfaceDisabled": "rgba(227, 226, 230, 0.38)",
//     "backdrop": "rgba(46, 48, 56, 0.4)"
//   }
// }


// //light color theme
// {
//   "colors": {
//     "primary": "rgb(0, 91, 193)",
//     "onPrimary": "rgb(255, 255, 255)",
//     "primaryContainer": "rgb(216, 226, 255)",
//     "onPrimaryContainer": "rgb(0, 26, 65)",
//     "secondary": "rgb(86, 94, 113)",
//     "onSecondary": "rgb(255, 255, 255)",
//     "secondaryContainer": "rgb(219, 226, 249)",
//     "onSecondaryContainer": "rgb(20, 27, 44)",
//     "tertiary": "rgb(0, 110, 47)",
//     "onTertiary": "rgb(255, 255, 255)",
//     "tertiaryContainer": "rgb(107, 255, 143)",
//     "onTertiaryContainer": "rgb(0, 33, 9)",
//     "error": "rgb(186, 26, 26)",
//     "onError": "rgb(255, 255, 255)",
//     "errorContainer": "rgb(255, 218, 214)",
//     "onErrorContainer": "rgb(65, 0, 2)",
//     "background": "rgb(254, 251, 255)",
//     "onBackground": "rgb(27, 27, 31)",
//     "surface": "rgb(254, 251, 255)",
//     "onSurface": "rgb(27, 27, 31)",
//     "surfaceVariant": "rgb(225, 226, 236)",
//     "onSurfaceVariant": "rgb(68, 71, 79)",
//     "outline": "rgb(116, 119, 127)",
//     "outlineVariant": "rgb(196, 198, 208)",
//     "shadow": "rgb(0, 0, 0)",
//     "scrim": "rgb(0, 0, 0)",
//     "inverseSurface": "rgb(48, 48, 51)",
//     "inverseOnSurface": "rgb(242, 240, 244)",
//     "inversePrimary": "rgb(173, 198, 255)",
//     "elevation": {
//       "level0": "transparent",
//       "level1": "rgb(241, 243, 252)",
//       "level2": "rgb(234, 238, 250)",
//       "level3": "rgb(226, 233, 248)",
//       "level4": "rgb(224, 232, 248)",
//       "level5": "rgb(218, 229, 246)"
//     },
//     "surfaceDisabled": "rgba(27, 27, 31, 0.12)",
//     "onSurfaceDisabled": "rgba(27, 27, 31, 0.38)",
//     "backdrop": "rgba(46, 48, 56, 0.4)"
//   }
// }
