import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/authenticated-request';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InviteResponseDto, OkResponseDto, ProjectResponseDto } from '../common/dto';
import { AcceptInviteDto, CreateInviteDto } from './invites.dto';
import { InvitesService } from './invites.service';

@ApiTags('invites')
@Controller()
export class InvitesController {
  constructor(private readonly invites: InvitesService) {}

  @Post('projects/:projectId/invites')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create project invite. Owner only.' })
  @ApiCreatedResponse({ type: InviteResponseDto })
  create(@Req() req: AuthenticatedRequest, @Param('projectId') projectId: string, @Body() body: CreateInviteDto) {
    return this.invites.create(projectId, this.userId(req), body);
  }

  @Get('invites/:token')
  @ApiOperation({ summary: 'Get invite by token' })
  @ApiOkResponse({ type: InviteResponseDto })
  get(@Param('token') token: string) {
    return this.invites.get(token);
  }

  @Post('invites/:token/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept invite' })
  @ApiOkResponse({ type: ProjectResponseDto })
  accept(@Req() req: AuthenticatedRequest, @Param('token') token: string, @Body() body: AcceptInviteDto) {
    return this.invites.accept(token, this.userId(req), body.calendarSyncMode);
  }

  @Post('invites/:token/decline')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Decline invite' })
  @ApiOkResponse({ type: OkResponseDto })
  decline(@Req() req: AuthenticatedRequest, @Param('token') token: string) {
    return this.invites.decline(token, this.userId(req));
  }

  private userId(req: AuthenticatedRequest) {
    return req.user.id;
  }
}
