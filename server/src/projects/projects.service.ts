import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CalendarSyncMode, ProjectRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async assertMember(projectId: string, userId: string) {
    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this project.');
    }

    return member;
  }

  async assertOwner(projectId: string, userId: string) {
    const member = await this.assertMember(projectId, userId);

    if (member.role !== ProjectRole.OWNER) {
      throw new ForbiddenException('Only the project owner can do this.');
    }

    return member;
  }

  async list(userId: string) {
    return this.prisma.project.findMany({
      where: { members: { some: { userId } } },
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(userId: string, data: { name: string; color: string }) {
    return this.prisma.project.create({
      data: {
        ...data,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: ProjectRole.OWNER,
            calendarSyncMode: CalendarSyncMode.NONE,
          },
        },
      },
      include: { members: true },
    });
  }

  async get(projectId: string, userId: string) {
    await this.assertMember(projectId, userId);

    return this.prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
        },
      },
    });
  }

  async update(projectId: string, userId: string, data: { name?: string; color?: string }) {
    await this.assertOwner(projectId, userId);

    return this.prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  async delete(projectId: string, userId: string) {
    await this.assertOwner(projectId, userId);
    await this.prisma.project.delete({ where: { id: projectId } });

    return { ok: true };
  }

  async members(projectId: string, userId: string) {
    await this.assertMember(projectId, userId);

    return this.prisma.projectMember.findMany({
      where: { projectId },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async updateMember(
    projectId: string,
    memberId: string,
    userId: string,
    data: { calendarSyncMode?: CalendarSyncMode },
  ) {
    const requester = await this.assertMember(projectId, userId);
    const member = await this.prisma.projectMember.findFirst({ where: { id: memberId, projectId } });

    if (!member) {
      throw new NotFoundException('Project member not found.');
    }

    if (requester.role !== ProjectRole.OWNER && requester.id !== member.id) {
      throw new ForbiddenException('You cannot update this project member.');
    }

    return this.prisma.projectMember.update({
      where: { id: memberId },
      data,
    });
  }

  async removeMember(projectId: string, memberId: string, userId: string) {
    await this.assertOwner(projectId, userId);
    const member = await this.prisma.projectMember.findFirst({ where: { id: memberId, projectId } });

    if (!member) {
      throw new NotFoundException('Project member not found.');
    }

    if (member.role === ProjectRole.OWNER) {
      throw new ForbiddenException('Project owner cannot be removed.');
    }

    await this.prisma.projectMember.delete({ where: { id: memberId } });

    return { ok: true };
  }
}
