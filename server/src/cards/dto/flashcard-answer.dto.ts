import { ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { TaskType } from "generated/prisma";

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

  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType = TaskType.FLASHCARDS;
}