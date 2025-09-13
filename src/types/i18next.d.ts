import 'i18next';
import translation from '../locales/en/translation.json';
import auth from '../locales/en/auth.json';
import generated from '../locales/en/generated.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof translation;
      auth: typeof auth;
      generated: typeof generated;
    };
  }
}
