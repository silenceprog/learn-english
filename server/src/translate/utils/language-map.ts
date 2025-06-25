import { Language } from '../enums/language.enum';

export const LanguageMap: Record<Language, string> = {
  [Language.EN]: 'en',
  [Language.UA]: 'uk',
  [Language.FR]: 'fr',
  [Language.ES]: 'es',
  [Language.DE]: 'de',
  [Language.IT]: 'it'
};

export const SupportedDictionaryLangs = ['en', 'es', 'fr', 'de', 'it'];