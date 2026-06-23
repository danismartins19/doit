import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UserResponseDto } from '../common/dto';

export class GoogleTokenLoginDto {
  @ApiProperty()
  @IsString()
  idToken!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class UpdateCalendarPreferenceDto {
  @ApiProperty()
  @IsBoolean()
  calendarSyncEnabled!: boolean;
}

export class GoogleTokenLoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  token!: string;

  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;
}
