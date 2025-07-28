import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";

export class UpdateSkillProgressDto {
  @ApiProperty({
    description: 'Whether the answer/exercise was correct',
    example: true,
    type: Boolean
  })
  @IsBoolean({ message: 'isCorrect must be a boolean value' })
  isCorrect: boolean;

  @ApiProperty({
    description: 'Experience points earned from this exercise',
    example: 15,
    minimum: 1,
    maximum: 1000,
    type: Number
  })
  @IsNumber({}, { message: 'xpEarned must be a number' })
  @IsPositive({ message: 'xpEarned must be positive' })
  @Min(1, { message: 'xpEarned must be at least 1' })
  @Max(1000, { message: 'xpEarned cannot exceed 1000' })
  xpEarned: number;

  @ApiProperty({
    description: 'Time spent on this exercise in seconds',
    example: 45,
    minimum: 1,
    maximum: 7200,
    type: Number
  })
  @IsNumber({}, { message: 'timeSpent must be a number' })
  @IsPositive({ message: 'timeSpent must be positive' })
  @Min(1, { message: 'timeSpent must be at least 1 second' })
  @Max(7200, { message: 'timeSpent cannot exceed 2 hours (7200 seconds)' })
  timeSpent: number;

  @ApiProperty({
    description: 'Whether a new word was learned (for vocabulary exercises)',
    example: true,
    required: false,
    type: Boolean
  })
  @IsOptional()
  @IsBoolean({ message: 'wordLearned must be a boolean value' })
  wordLearned?: boolean;
}