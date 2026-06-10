import { ForbiddenException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { CalendarSyncMode, InviteStatus, ProjectRole } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class InvitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projects: ProjectsService,
  ) {}

  async create(projectId: string, userId: string, data: { email?: string; expiresInDays?: number }) {
    await this.projects.assertOwner(projectId, userId);

    const token = randomBytes(24).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.expiresInDays ?? 7));

    return this.prisma.projectInvite.create({
      data: {
        projectId,
        createdById: userId,
        email: data.email,
        token,
        expiresAt,
      },
    });
  }

  async get(token: string) {
    const invite = await this.prisma.projectInvite.findUnique({
      where: { token },
      include: {
        project: true,
        createdBy: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found.');
    }

    return invite;
  }

  async accept(token: string, userId: string, calendarSyncMode: CalendarSyncMode) {
    const invite = await this.get(token);

    if (invite.status !== InviteStatus.PENDING) {
      throw new GoneException('Invite is not pending.');
    }

    if (invite.expiresAt < new Date()) {
      await this.prisma.projectInvite.update({
        where: { id: invite.id },
        data: { status: InviteStatus.EXPIRED },
      });
      throw new GoneException('Invite expired.');
    }

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    if (invite.email && invite.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new ForbiddenException('Invite belongs to another email.');
    }

    await this.prisma.$transaction([
      this.prisma.projectMember.upsert({
        where: { projectId_userId: { projectId: invite.projectId, userId } },
        update: { calendarSyncMode },
        create: {
          projectId: invite.projectId,
          userId,
          role: ProjectRole.MEMBER,
          calendarSyncMode,
        },
      }),
      this.prisma.projectInvite.update({
        where: { id: invite.id },
        data: { status: InviteStatus.ACCEPTED, acceptedAt: new Date() },
      }),
    ]);

    return this.projects.get(invite.projectId, userId);
  }

  async decline(token: string, userId: string) {
    const invite = await this.get(token);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    if (invite.email && invite.email.toLowerCase() !== user.email.toLowerCase()) {
      throw new ForbiddenException('Invite belongs to another email.');
    }

    await this.prisma.projectInvite.update({
      where: { id: invite.id },
      data: { status: InviteStatus.DECLINED },
    });

    return { ok: true };
  }
}
