import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalendarSyncMode } from '@prisma/client';
import { IsEmail, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateInviteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(30)
  expiresInDays?: number;
}

export class AcceptInviteDto {
  @ApiProperty({ enum: CalendarSyncMode, default: CalendarSyncMode.NONE })
  @IsEnum(CalendarSyncMode)
  calendarSyncMode: CalendarSyncMode = CalendarSyncMode.NONE;
}
