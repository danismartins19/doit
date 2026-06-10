import { Injectable } from '@nestjs/common';
import { CalendarSyncMode, Task, User } from '@prisma/client';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async syncTask(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        responsible: true,
      },
    });

    if (!task?.responsible) {
      return task;
    }

    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId: task.responsible.id } },
    });

    const shouldSync =
      task.responsible.calendarSyncEnabled &&
      member?.calendarSyncMode !== CalendarSyncMode.NONE &&
      Boolean(task.responsible.googleRefreshToken);

    if (!shouldSync) {
      return task;
    }

    const eventId = await this.upsertCalendarEvent(task, task.responsible);

    if (eventId && eventId !== task.googleCalendarEventId) {
      return this.prisma.task.update({
        where: { id: task.id },
        data: { googleCalendarEventId: eventId },
      });
    }

    return task;
  }

  async deleteTaskEvent(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { responsible: true },
    });

    if (!task?.googleCalendarEventId || !task.responsible?.googleRefreshToken) {
      return;
    }

    const calendar = this.getCalendarClient(task.responsible);

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: task.googleCalendarEventId,
    });
  }

  private async upsertCalendarEvent(task: Task, user: User) {
    const calendar = this.getCalendarClient(user);
    const start = task.deadline ?? task.day;
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const requestBody = {
      summary: task.title,
      description: [task.description, task.details].filter(Boolean).join('\n\n'),
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    };

    if (task.googleCalendarEventId) {
      const { data } = await calendar.events.update({
        calendarId: 'primary',
        eventId: task.googleCalendarEventId,
        requestBody,
      });

      return data.id ?? task.googleCalendarEventId;
    }

    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      requestBody,
    });

    return data.id ?? null;
  }

  private getCalendarClient(user: User) {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3333/auth/google/callback',
    );

    auth.setCredentials({
      access_token: user.googleAccessToken ?? undefined,
      refresh_token: user.googleRefreshToken ?? undefined,
    });

    return google.calendar({ version: 'v3', auth });
  }
}
