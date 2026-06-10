import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateCalendarPreferenceDto {
  @ApiProperty()
  @IsBoolean()
  calendarSyncEnabled: boolean;
}
