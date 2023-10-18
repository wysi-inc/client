import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const fallbackLng = ['en'];
export const availableLanguages = [
    'af', 'ca', 'de', 'en', 'es', 'et', 'gl', 'it', 'lv', 'hu', 
    'nl', 'no', 'pl', 'pt', 'pt-br', 'ru', 'fi', 'sr', 'tr', 'ja', 
    'zh', 'zh-hant', 'eo'
];

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng,
        detection: {
            checkWhitelist: true
        },
        debug: false,
        whitelist: availableLanguages,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n