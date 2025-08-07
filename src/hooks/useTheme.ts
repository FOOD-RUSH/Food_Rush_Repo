import { useAppStore } from '@/src/stores/AppStore';

export const useTheme = () => {
  const { theme, setTheme } = useAppStore();
  return { theme, toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light') };
};
