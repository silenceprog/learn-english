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

    const lingvaUrl = `https://lingva.ml/api/v1/${fromIso}/${toIso}/${encodeURIComponent(text)}`;
    const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/${fromIso}/${text}`;

    try {
      const lingvaRes = await firstValueFrom(this.httpService.get(lingvaUrl));

      let dictionaryRes: any = null;
      if (SupportedDictionaryLangs.includes(fromIso)) {
        const dict = await firstValueFrom(this.httpService.get(dictionaryUrl));
        dictionaryRes = dict.data;
      }

      return {
        translation: lingvaRes.data.translation,
        dictionary: dictionaryRes,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { message: 'Word not found in dictionary' };
      }
      throw new BadRequestException(error.message || 'Translation failed');
    }
  }
}
