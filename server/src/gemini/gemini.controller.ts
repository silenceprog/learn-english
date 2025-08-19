import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeminiService } from './gemini.service';
import { history_story } from './history';

@Controller('gemini')
export class GeminiController {
  private readonly model_think_new = 'gemini-2.5-pro';
  private readonly model_flesh_new = 'gemini-2.5-flash'
  private readonly model_econom_new = 'gemini-2.5-flash-lite-preview-06-17'
   private readonly model_audio_new = 'gemini-2.5-pro-preview-tts'
  private readonly model_flash = 'gemini-2.0-flash';
  constructor(private readonly geminiService: GeminiService) {}

  @Post('generate')
  async generateText(@Body() body: { prompt: string }) {
    const result = await this.geminiService.generateText(this.model_think_new,body.prompt);
    return { response: result };
  }

  @Post('analyze-image')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(
    @Body() body: { prompt: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.geminiService.generateFromImage(this.model_flash,
      body.prompt,
      file.buffer
    );
    return { response: result };
  }

  @Post('generate-grounded')
  async generateGroundedText(@Body() body: { prompt: string }) {
    const result = await this.geminiService.generateGroundedText(this.model_think_new,body.prompt);
    return { response: result };
  }

  @Post('generate-text-history')
  async generateTextHistory(@Body() body: { prompt: string }) {
    const result = await this.geminiService.generateTextHistory(history_story,this.model_think_new,body.prompt);
    return { response: result };
  }
}