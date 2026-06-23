import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalendarSyncMode, InviteStatus, ProjectRole, TaskStatus } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  avatarUrl?: string | null;

  @ApiProperty()
  calendarSyncEnabled: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}

export class ProjectMemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ProjectRole })
  role: ProjectRole;

  @ApiProperty({ enum: CalendarSyncMode })
  calendarSyncMode: CalendarSyncMode;

  @ApiProperty({ type: String, format: 'date-time' })
  joinedAt: Date;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  user?: UserResponseDto;
}

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  owner?: UserResponseDto;

  @ApiPropertyOptional({ type: () => [ProjectMemberResponseDto] })
  members?: ProjectMemberResponseDto[];
}

export class InviteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  email?: string | null;

  @ApiProperty()
  token: string;

  @ApiProperty({ enum: InviteStatus })
  status: InviteStatus;

  @ApiProperty()
  createdById: string;

  @ApiProperty({ type: String, format: 'date-time' })
  expiresAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  acceptedAt?: Date | null;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  project?: ProjectResponseDto;
}

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  createdById: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  responsibleId?: string | null;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  details?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  day: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  deadline?: Date | null;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  order: number;

  @ApiPropertyOptional({ type: String, nullable: true })
  googleCalendarEventId?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => ProjectResponseDto })
  project?: ProjectResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto })
  createdBy?: UserResponseDto;

  @ApiPropertyOptional({ type: () => UserResponseDto, nullable: true })
  responsible?: UserResponseDto | null;
}

export class OkResponseDto {
  @ApiProperty()
  ok: boolean;
}
