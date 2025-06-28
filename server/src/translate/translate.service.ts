import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Language } from './enums/language.enum';
import { LanguageMap, SupportedDictionaryLangs } from './utils/language-map';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TranslateService {
  constructor(private readonly httpService: HttpService) {}

  async wordTranslate(text: string, from: Language, to: Language) {
  const fromIso = LanguageMap[from];
  const toIso = LanguageMap[to];

  if (!fromIso || !toIso) {
    throw new BadRequestException('Unsupported language');
  }

  const libreTranslateUrl = 'https://libretranslate.de/translate';
  const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/${fromIso}/${text}`;

  try {
    const libreRes = await firstValueFrom(
      this.httpService.post(
        libreTranslateUrl,
        {
          q: text,
          source: fromIso,
          target: toIso,
          format: 'text',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );

    let dictionaryRes: any = null;
    if (SupportedDictionaryLangs.includes(fromIso)) {
      const dict = await firstValueFrom(this.httpService.get(dictionaryUrl));
      dictionaryRes = dict.data;
    }

    return {
      translation: libreRes.data.translatedText,
      dictionary: dictionaryRes,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return { message: 'Word not found in dictionary' };
    }

    console.error('LibreTranslate error:', error.message, error.response?.data);
    throw new BadRequestException(error.message || 'Translation failed');
  }
}
}
