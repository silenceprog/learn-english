import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenAI;
  private readonly logger = new Logger(GeminiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new HttpException(
        'GEMINI_API_KEY не найден в конфигурации',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this.genAI = new GoogleGenAI({ apiKey: apiKey });
  }

  async generateText(prompt: string): Promise<string | undefined> {
    try {
      this.logger.log(
        `Generating text for prompt: "${prompt.substring(0, 50)}..."`,
      );
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
      });
      this.logger.log('Text generation successful.');
      return response.text;
    } catch (error) {
      throw new Error(`Ошибка генерации текста: ${error.message}`);
    }
  }

  async generateFromImage(
    prompt: string,
    imageBuffer: Buffer,
  ): Promise<string | undefined> {
    try {
      const contents = [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBuffer.toString('base64'),
          },
        },
        { text: prompt },
      ];

      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: contents,
      });
      this.logger.log('Image understanding successful.');
      return response.text;
    } catch (error) {
      throw new Error(`Error understanding image: ${error.message}`);
    }
  }

  async generateGroundedText(prompt: string): Promise<string | undefined> {
    const groundingTool = {
      googleSearch: {},
    };

    const config = {
      tools: [groundingTool],
    };
    try {
      this.logger.log(
        `Generating grounded text for prompt: "${prompt.substring(0, 50)}..."`,
      );
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config,
      });

      const text = response.text;
      this.logger.log('Grounded text generation successful.');
      return this.addCitations(response);
    } catch (error) {
      this.logger.error(
        `Error generating grounded text: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to generate grounded text: ${error.message}`);
    }
  }

  async addCitations(response) {
    let text = response.text;
    const supports =
      response.candidates[0]?.groundingMetadata?.groundingSupports;
    const chunks = response.candidates[0]?.groundingMetadata?.groundingChunks;

    const sortedSupports = [...supports].sort(
      (a, b) => (b.segment?.endIndex ?? 0) - (a.segment?.endIndex ?? 0),
    );

    for (const support of sortedSupports) {
      const endIndex = support.segment?.endIndex;
      if (endIndex === undefined || !support.groundingChunkIndices?.length) {
        continue;
      }

      const citationLinks = support.groundingChunkIndices
        .map((i) => {
          const uri = chunks[i]?.web?.uri;
          if (uri) {
            return `[${i + 1}](${uri})`;
          }
          return null;
        })
        .filter(Boolean);

      if (citationLinks.length > 0) {
        const citationString = citationLinks.join(', ');
        text = text.slice(0, endIndex) + citationString + text.slice(endIndex);
      }
    }

    return text;
  }
}
