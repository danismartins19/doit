import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { TaskResponseDto } from '../common/dto';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('tasks')
  @ApiOperation({ summary: 'Search tasks globally in current user projects' })
  @ApiQuery({ name: 'q', required: true })
  @ApiOkResponse({ type: [TaskResponseDto] })
  async tasks(@Req() req: Request, @Query('q') q = '') {
    const userId = this.auth.verifyToken(this.auth.getTokenFromRequest(req));
    const query = q.trim();

    if (!query) {
      return [];
    }

    return this.prisma.task.findMany({
      where: {
        project: { members: { some: { userId } } },
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { details: { contains: query } },
          { project: { name: { contains: query } } },
          { responsible: { name: { contains: query } } },
          { responsible: { email: { contains: query } } },
        ],
      },
      include: {
        project: true,
        createdBy: { select: { id: true, name: true, email: true, avatarUrl: true } },
        responsible: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: [{ day: 'asc' }, { order: 'asc' }],
      take: 50,
    });
  }
}
