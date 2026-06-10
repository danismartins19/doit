export type CalendarSyncMode = "ALL" | "ONLY_NEW" | "NONE";
export type ProjectRole = "OWNER" | "MEMBER";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "CANCELED";
export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  calendarSyncEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMemberResponse {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  calendarSyncMode: CalendarSyncMode;
  joinedAt: string;
  user?: UserResponse;
}

export interface ProjectResponse {
  id: string;
  name: string;
  color: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: UserResponse;
  members?: ProjectMemberResponse[];
}

export interface InviteResponse {
  id: string;
  projectId: string;
  email: string | null;
  token: string;
  status: InviteStatus;
  createdById: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt: string | null;
  project?: ProjectResponse;
}

export interface TaskResponse {
  id: string;
  projectId: string;
  createdById: string;
  responsibleId: string | null;
  title: string;
  description: string | null;
  details: string | null;
  day: string;
  deadline: string | null;
  status: TaskStatus;
  order: number;
  googleCalendarEventId: string | null;
  createdAt: string;
  updatedAt: string;
  project?: ProjectResponse;
  createdBy?: UserResponse;
  responsible?: UserResponse | null;
}
