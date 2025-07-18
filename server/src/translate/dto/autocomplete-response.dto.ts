import { ApiProperty } from '@nestjs/swagger';

export class AutocompleteResponse {
  @ApiProperty({
    description: 'Масив пропозицій автозаповнення',
    type: [String],
    example: ['hello', 'help', 'helmet', 'helicopter'],
  })
  suggestions: string[];

  @ApiProperty({
    description: 'Джерело пропозицій',
    enum: ['api', 'local'],
    example: 'api',
  })
  source: 'api' | 'local';

  @ApiProperty({
    description: 'Нормалізований запит, який було оброблено',
    example: 'hel',
  })
  query: string;
}

export class DatamuseSuggestion {
  @ApiProperty({
    description: 'Пропоноване слово',
    example: 'hello',
  })
  word: string;

  @ApiProperty({
    description: "Оцінка, що вказує на релевантність (необов'язково)",
    example: 12345,
    required: false,
  })
  score?: number;
}