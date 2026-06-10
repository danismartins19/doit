import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { UserResponseDto } from '../common/dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './users.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  async me(@Req() req: Request) {
    const userId = this.auth.verifyToken(this.auth.getTokenFromRequest(req));

    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        calendarSyncEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  async updateMe(@Req() req: Request, @Body() body: UpdateUserDto) {
    const userId = this.auth.verifyToken(this.auth.getTokenFromRequest(req));

    return this.prisma.user.update({
      where: { id: userId },
      data: body,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        calendarSyncEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
