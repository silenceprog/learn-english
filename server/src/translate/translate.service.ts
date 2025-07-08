import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException } from '@nestjs/common';
import { LanguageMap, SupportedDictionaryLangs } from './utils/language-map';
import { firstValueFrom } from 'rxjs';
import { Language } from 'generated/prisma';

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
          { q: text, source: fromIso, target: toIso, format: 'text' },
          { headers: { 'Content-Type': 'application/json' } },
        ),
      );

      let phonetic = 'none';
      let audio = 'none';
      let phoneticUS = null;
      let audioUS = null;

      if (SupportedDictionaryLangs.includes(fromIso)) {
        const dictRes = await firstValueFrom(
          this.httpService.get(dictionaryUrl),
        );
        const entry = dictRes.data[0]; 

        if (entry?.phonetics?.length) {
          for (const p of entry.phonetics) {
            if (p.text && phonetic === 'none') {
              phonetic = p.text;
            }

            if (p.audio && audio === 'none') {
              audio = p.audio;
            }

            if (p.audio?.includes('-us.mp3')) {
              phoneticUS = p.text || phoneticUS;
              audioUS = p.audio || audioUS;
            }
          }
        }
      }

      return {
        phonetic,
        audio,
        phoneticUS,
        audioUS,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { message: 'Word not found in dictionary' };
      }

      throw new BadRequestException(error.message || 'Translation failed');
    }
  }
}
