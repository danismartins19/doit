import { Body, Controller, Get, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { OkResponseDto, UserResponseDto } from '../common/dto';
import { GoogleTokenLoginDto, GoogleTokenLoginResponseDto, UpdateCalendarPreferenceDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedRequest } from './authenticated-request';

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

  @Post('google/token')
  @ApiOperation({ summary: 'Exchange a Google token for an application token' })
  @ApiOkResponse({ type: GoogleTokenLoginResponseDto })
  async googleToken(@Body() body: GoogleTokenLoginDto) {
    const { token, user } = await this.auth.handleGoogleTokenLogin(body);

    return {
      accessToken: token,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        calendarSyncEnabled: user.calendarSyncEnabled,
      },
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout current user' })
  @ApiOkResponse({ type: OkResponseDto })
  logout(@Res() res: Response) {
    res.clearCookie(this.auth.getCookieName());
    return res.json({ ok: true });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user' })
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

  @Patch('me/calendar-preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update global Google Calendar preference' })
  @ApiOkResponse({ type: UserResponseDto })
  async updateCalendarPreference(@Req() req: AuthenticatedRequest, @Body() body: UpdateCalendarPreferenceDto) {
    return this.prisma.user.update({
      where: { id: req.user.id },
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
