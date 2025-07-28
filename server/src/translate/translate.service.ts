import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LanguageMap, SupportedDictionaryLangs } from './utils/language-map';
import { firstValueFrom } from 'rxjs';
import { Language } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { AutocompleteResponse, DatamuseSuggestion } from './dto/autocomplete-response.dto';

@Injectable()
export class TranslateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly databaseService: DatabaseService,
  ) {}

  private readonly API_BASE_URL = 'https://api.datamuse.com';
  private readonly MAX_SUGGESTIONS = 10;

  async getSuggestions(query: string): Promise<AutocompleteResponse> {
    if (!query || query.length < 2) {
      return {
        suggestions: [],
        source: 'local',
        query,
      };
    }

    const normalizedQuery = query.toLowerCase().trim();
    try {
      const apiSuggestions = await this.fetchFromDatamuse(normalizedQuery);

      return {
        suggestions: apiSuggestions,
        source: 'api',
        query: normalizedQuery,
      };
    } catch (error) {
      console.error('Datamuse API error:', error);

      return {
        suggestions: [],
        source: 'local',
        query: normalizedQuery,
      };
    }
  }

  private async fetchFromDatamuse(query: string): Promise<string[]> {
    const url = `${this.API_BASE_URL}/sug`;
    const params = {
      s: query,
      max: this.MAX_SUGGESTIONS,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get<DatamuseSuggestion[]>(url, { params }),
      );

      return response?.data?.map((item) => item.word) || [];
    } catch (error) {
      throw new HttpException(
        'Failed to fetch suggestions from Datamuse API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getWordsStartingWith(query: string): Promise<string[]> {
    try {
      const url = `${this.API_BASE_URL}/words`;
      const params = {
        sp: `${query}*`,
        max: this.MAX_SUGGESTIONS,
      };

      const response = await firstValueFrom(
        this.httpService.get<DatamuseSuggestion[]>(url, { params }),
      );

      return response?.data?.map((item) => item.word) || [];
    } catch (error) {
      throw new HttpException(
        'Failed to fetch suggestions from Datamuse API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getRelatedWords(query: string): Promise<string[]> {
    try {
      const url = `${this.API_BASE_URL}/words`;
      const params = {
        ml: query,
        max: this.MAX_SUGGESTIONS,
      };

      const response = await firstValueFrom(
        this.httpService.get<DatamuseSuggestion[]>(url, { params }),
      );

      return response?.data?.map((item) => item.word) || [];
    } catch (error) {
      return [];
    }
  }

  async wordTranslate(text: string, from: Language, to: Language) {
    const fromIso = LanguageMap[from];
    const toIso = LanguageMap[to];

    if (!fromIso || !toIso) {
      throw new BadRequestException('Unsupported language');
    }

    const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/${fromIso}/${text}`;

    try {
      let phonetic = 'none';
      let audio = 'none';
      let phoneticUS = null;
      let audioUS = null;
      let meanings;

      if (SupportedDictionaryLangs.includes(fromIso)) {
        const dictRes = await firstValueFrom(
          this.httpService.get(dictionaryUrl),
        );
        const entry = dictRes.data[0];
        meanings = entry.meanings;

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
        meanings,
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { message: 'Word not found in dictionary' };
      }

      throw new BadRequestException(error.message || 'Translation failed');
    }
  }

  public processMeanings(meanings: any[]): {
    definitions: string[];
    synonyms: string[];
    antonyms: string[];
    examples: string[];
    partOfSpeech: string;
  } {
    const definitions: string[] = [];
    const synonyms: Set<string> = new Set();
    const antonyms: Set<string> = new Set();
    const examples: Set<string> = new Set();
    let partOfSpeech = '';

    if (meanings && meanings.length > 0) {
      partOfSpeech = meanings[0].partOfSpeech || '';

      meanings.forEach((meaning) => {
        if (meaning.synonyms && Array.isArray(meaning.synonyms)) {
          meaning.synonyms.forEach((synonym: string) => synonyms.add(synonym));
        }

        if (meaning.antonyms && Array.isArray(meaning.antonyms)) {
          meaning.antonyms.forEach((antonym: string) => antonyms.add(antonym));
        }

        if (meaning.definitions && Array.isArray(meaning.definitions)) {
          meaning.definitions.forEach((def: any) => {
            if (def.definition) {
              definitions.push(def.definition);
            }

            if (def.example) {
              examples.add(def.example);
            }

            if (def.synonyms && Array.isArray(def.synonyms)) {
              def.synonyms.forEach((synonym: string) => synonyms.add(synonym));
            }

            if (def.antonyms && Array.isArray(def.antonyms)) {
              def.antonyms.forEach((antonym: string) => antonyms.add(antonym));
            }
          });
        }
      });
    }

    return {
      definitions,
      synonyms: Array.from(synonyms),
      antonyms: Array.from(antonyms),
      examples: Array.from(examples),
      partOfSpeech,
    };
  }

  async updateWordMeanings(
    wordId: number,
    userId: number,
    updateData: {
      definitions?: string[];
      synonyms?: string[];
      antonyms?: string[];
      examples?: string[];
      partOfSpeech?: string;
    },
  ) {
    const word = await this.databaseService.word.findFirst({
      where: { id: wordId, userId: userId },
    });

    if (!word) {
      throw new NotFoundException('Word not found or access denied');
    }

    return this.databaseService.word.update({
      where: { id: wordId },
      data: updateData,
    });
  }

  

}
