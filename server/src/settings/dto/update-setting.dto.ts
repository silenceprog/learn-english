import { Language, Level, Purpose } from 'generated/prisma';

export class UpdateSettingDto {
  current_language?: Language;
  global_language?: Language;
  purposes?: Purpose[];
  current_level?: Level;
}
