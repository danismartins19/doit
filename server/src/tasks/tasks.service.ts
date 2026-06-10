import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { CalendarService } from '../calendar/calendar.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';

interface TaskInput {
  title?: string;
  description?: string;
  details?: string;
  day?: Date;
  deadline?: Date | null;
  responsibleId?: string | null;
  status?: TaskStatus;
  order?: number;
}

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projects: ProjectsService,
    private readonly calendar: CalendarService,
  ) {}

  async list(projectId: string, userId: string, status?: TaskStatus) {
    await this.projects.assertMember(projectId, userId);

    return this.prisma.task.findMany({
      where: { projectId, ...(status ? { status } : {}) },
      include: this.include,
      orderBy: [{ day: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async create(projectId: string, userId: string, data: Required<Pick<TaskInput, 'title' | 'day'>> & TaskInput) {
    await this.projects.assertMember(projectId, userId);
    await this.assertResponsible(projectId, data.responsibleId);

    const task = await this.prisma.task.create({
      data: {
        projectId,
        createdById: userId,
        title: data.title,
        description: data.description,
        details: data.details,
        day: data.day,
        deadline: data.deadline,
        responsibleId: data.responsibleId,
        status: data.status,
        order: data.order,
      },
      include: this.include,
    });

    await this.calendar.syncTask(task.id);
    return this.get(task.id, userId);
  }

  async get(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: this.include,
    });

    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    await this.projects.assertMember(task.projectId, userId);
    return task;
  }

  async update(taskId: string, userId: string, data: TaskInput) {
    const task = await this.get(taskId, userId);
    await this.assertResponsible(task.projectId, data.responsibleId);

    await this.prisma.task.update({
      where: { id: taskId },
      data,
    });

    await this.calendar.syncTask(taskId);
    return this.get(taskId, userId);
  }

  async delete(taskId: string, userId: string) {
    const task = await this.get(taskId, userId);
    await this.calendar.deleteTaskEvent(task.id);
    await this.prisma.task.delete({ where: { id: taskId } });

    return { ok: true };
  }

  async move(taskId: string, userId: string, data: { day: Date; order?: number }) {
    return this.update(taskId, userId, data);
  }

  async status(taskId: string, userId: string, status: TaskStatus) {
    return this.update(taskId, userId, { status });
  }

  async responsible(taskId: string, userId: string, responsibleId: string | null) {
    return this.update(taskId, userId, { responsibleId });
  }

  private async assertResponsible(projectId: string, responsibleId?: string | null) {
    if (!responsibleId) {
      return;
    }

    const responsible = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: responsibleId } },
    });

    if (!responsible) {
      throw new ForbiddenException('Responsible user must be a project member.');
    }
  }

  private get include() {
    return {
      project: true,
      createdBy: { select: { id: true, name: true, email: true, avatarUrl: true } },
      responsible: { select: { id: true, name: true, email: true, avatarUrl: true } },
    };
  }
}
