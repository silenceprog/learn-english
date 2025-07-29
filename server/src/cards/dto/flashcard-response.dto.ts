import { ApiProperty } from "@nestjs/swagger";

export class FlashcardResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  translate: string[];

  @ApiProperty()
  examples: string[];

  @ApiProperty()
  phonetic: string;

  @ApiProperty()
  audio: string;

  @ApiProperty()
  phoneticUS: string;

  @ApiProperty()
  audioUS: string;

  @ApiProperty()
  totalProgress: number;

  @ApiProperty()
  isLearned: boolean;

  @ApiProperty()
  nextReviewAt?: Date;

  @ApiProperty()
  reviewInterval: number;

  @ApiProperty()
  attempts: number;

  @ApiProperty()
  correctCount: number;
}