import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalendarSyncMode } from '@prisma/client';
import { IsEnum, IsHexColor, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: '#0ea5b7' })
  @IsHexColor()
  color: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class UpdateProjectMemberDto {
  @ApiPropertyOptional({ enum: CalendarSyncMode })
  @IsOptional()
  @IsEnum(CalendarSyncMode)
  calendarSyncMode?: CalendarSyncMode;
}
