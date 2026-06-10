import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalendarSyncMode, InviteStatus, ProjectRole, TaskStatus } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl?: string | null;

  @ApiProperty()
  calendarSyncEnabled: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
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

  @ApiProperty()
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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
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

  @ApiPropertyOptional({ nullable: true })
  email?: string | null;

  @ApiProperty()
  token: string;

  @ApiProperty({ enum: InviteStatus })
  status: InviteStatus;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ nullable: true })
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

  @ApiPropertyOptional({ nullable: true })
  responsibleId?: string | null;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ nullable: true })
  details?: string | null;

  @ApiProperty()
  day: Date;

  @ApiPropertyOptional({ nullable: true })
  deadline?: Date | null;

  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;

  @ApiProperty()
  order: number;

  @ApiPropertyOptional({ nullable: true })
  googleCalendarEventId?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
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
