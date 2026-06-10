import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { InviteResponseDto, OkResponseDto, ProjectResponseDto } from '../common/dto';
import { AcceptInviteDto, CreateInviteDto } from './invites.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@Controller()
export class InvitesController {
  constructor(
    private readonly auth: AuthService,
    private readonly invites: InvitesService,
  ) {}

  @Post('projects/:projectId/invites')
  @ApiOperation({ summary: 'Create project invite. Owner only.' })
  @ApiCreatedResponse({ type: InviteResponseDto })
  create(@Req() req: Request, @Param('projectId') projectId: string, @Body() body: CreateInviteDto) {
    return this.invites.create(projectId, this.userId(req), body);
  }

  @Get('invites/:token')
  @ApiOperation({ summary: 'Get invite by token' })
  @ApiOkResponse({ type: InviteResponseDto })
  get(@Param('token') token: string) {
    return this.invites.get(token);
  }

  @Post('invites/:token/accept')
  @ApiOperation({ summary: 'Accept invite' })
  @ApiOkResponse({ type: ProjectResponseDto })
  accept(@Req() req: Request, @Param('token') token: string, @Body() body: AcceptInviteDto) {
    return this.invites.accept(token, this.userId(req), body.calendarSyncMode);
  }

  @Post('invites/:token/decline')
  @ApiOperation({ summary: 'Decline invite' })
  @ApiOkResponse({ type: OkResponseDto })
  decline(@Req() req: Request, @Param('token') token: string) {
    return this.invites.decline(token, this.userId(req));
  }

  private userId(req: Request) {
    return this.auth.verifyToken(this.auth.getTokenFromRequest(req));
  }
}
