import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { CoreSkillType } from 'generated/prisma';

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
    enum: CoreSkillType,
    example: CoreSkillType.VOCABULARY,
  })
  @IsOptional()
  @IsEnum(CoreSkillType)
  skillType: CoreSkillType;

  @ApiPropertyOptional({
    description: 'Чи виконано завдання',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPassed: boolean;
}
