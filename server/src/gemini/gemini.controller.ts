import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('generate')
  async generateText(@Body() body: { prompt: string }) {
    const result = await this.geminiService.generateText(body.prompt);
    return { response: result };
  }

  @Post('analyze-image')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeImage(
    @Body() body: { prompt: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.geminiService.generateFromImage(
      body.prompt,
      file.buffer
    );
    return { response: result };
  }

  @Post('generate-grounded')
  async generateGroundedText(@Body() body: { prompt: string }) {
    const result = await this.geminiService.generateGroundedText(body.prompt);
    return { response: result };
  }
}