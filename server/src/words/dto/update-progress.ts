import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { CoreSkillType, TaskType } from 'generated/prisma';

export class UpdateProgressDto {
  @ApiProperty({
    description: 'Чи була відповідь правильною',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  correct?: boolean;

  @ApiProperty({
    description: 'Час, витрачений на завдання (в секундах)',
    minimum: 0,
    example: 30,
  })
  @IsNumber()
  @Min(0)
  timeSpent: number;

  @ApiPropertyOptional({
    description: 'Тип навички, що тренується',
    enum: TaskType,
    example: TaskType.FLASHCARDS,
  })
  @IsOptional()
  @IsEnum(TaskType)
  taskType: TaskType;

  @ApiPropertyOptional({
    description: 'Чи виконано завдання',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPassed: boolean;
}
