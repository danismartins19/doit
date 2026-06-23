import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/authenticated-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from '../common/dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './users.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: UserResponseDto })
  async me(@Req() req: AuthenticatedRequest) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: req.user.id },
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
  async updateMe(@Req() req: AuthenticatedRequest, @Body() body: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: req.user.id },
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
