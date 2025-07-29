import { ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class FlashcardAnswerDto {
  @ApiProperty({ description: 'ID слова' })
  @Type(() => Number)
  @IsInt()
  wordId: number;

  @ApiProperty({ description: 'Відповідь користувача' })
  @IsString()
  userAnswer: string;

  @ApiProperty({ description: 'Час відповіді в секундах' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  timeSpent: number;

  @ApiPropertyOptional({ description: 'Оцінка складності (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;
}