import { Body, Controller, Get, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { OkResponseDto, UserResponseDto } from '../common/dto';
import { UpdateCalendarPreferenceDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('google')
  @ApiOperation({ summary: 'Start Google OAuth login' })
  google(@Res() res: Response) {
    return res.redirect(this.auth.getGoogleAuthUrl());
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  async callback(@Query('code') code: string, @Res() res: Response) {
    const { token } = await this.auth.handleGoogleCallback(code);

    res.cookie(this.auth.getCookieName(), token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:3000');
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  @ApiOkResponse({ type: OkResponseDto })
  logout(@Res() res: Response) {
    res.clearCookie(this.auth.getCookieName());
    return res.json({ ok: true });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user' })
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

  @Patch('me/calendar-preferences')
  @ApiOperation({ summary: 'Update global Google Calendar preference' })
  @ApiOkResponse({ type: UserResponseDto })
  async updateCalendarPreference(@Req() req: Request, @Body() body: UpdateCalendarPreferenceDto) {
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
      },
    });
  }
}
