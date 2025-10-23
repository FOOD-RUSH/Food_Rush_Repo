// Relax react-i18next typing to accept string keys app-wide
// This avoids dozens of TS errors for dynamic translation keys while keeping runtime behavior.
import 'react-i18next';

declare module 'react-i18next' {
  // Widen the t() key type to simple string
  interface UseTranslationResponse<Ks extends string = string> {
    t: (key: string, defaultValue?: any) => any;
  }
}
