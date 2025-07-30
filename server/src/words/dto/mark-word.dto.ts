import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsOptional } from "class-validator";

export class MarkWordsLearnedDto {
  @ApiProperty({ description: 'Масив ID слів для позначення як вивчені', type: [Number] })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  wordIds: number[];
}
