import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { OkResponseDto, ProjectMemberResponseDto, ProjectResponseDto } from '../common/dto';
import { CreateProjectDto, UpdateProjectDto, UpdateProjectMemberDto } from './projects.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly auth: AuthService,
    private readonly projects: ProjectsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List projects for current user' })
  @ApiOkResponse({ type: [ProjectResponseDto] })
  list(@Req() req: Request) {
    return this.projects.list(this.userId(req));
  }

  @Post()
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({ type: ProjectResponseDto })
  create(@Req() req: Request, @Body() body: CreateProjectDto) {
    return this.projects.create(this.userId(req), body);
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Get project' })
  @ApiOkResponse({ type: ProjectResponseDto })
  get(@Req() req: Request, @Param('projectId') projectId: string) {
    return this.projects.get(projectId, this.userId(req));
  }

  @Patch(':projectId')
  @ApiOperation({ summary: 'Update project' })
  @ApiOkResponse({ type: ProjectResponseDto })
  update(@Req() req: Request, @Param('projectId') projectId: string, @Body() body: UpdateProjectDto) {
    return this.projects.update(projectId, this.userId(req), body);
  }

  @Delete(':projectId')
  @ApiOperation({ summary: 'Delete project' })
  @ApiOkResponse({ type: OkResponseDto })
  delete(@Req() req: Request, @Param('projectId') projectId: string) {
    return this.projects.delete(projectId, this.userId(req));
  }

  @Get(':projectId/members')
  @ApiOperation({ summary: 'List project members' })
  @ApiOkResponse({ type: [ProjectMemberResponseDto] })
  members(@Req() req: Request, @Param('projectId') projectId: string) {
    return this.projects.members(projectId, this.userId(req));
  }

  @Patch(':projectId/members/:memberId')
  @ApiOperation({ summary: 'Update project member preferences' })
  @ApiOkResponse({ type: ProjectMemberResponseDto })
  updateMember(
    @Req() req: Request,
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() body: UpdateProjectMemberDto,
  ) {
    return this.projects.updateMember(projectId, memberId, this.userId(req), body);
  }

  @Delete(':projectId/members/:memberId')
  @ApiOperation({ summary: 'Remove project member. Owner only.' })
  @ApiOkResponse({ type: OkResponseDto })
  removeMember(
    @Req() req: Request,
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.projects.removeMember(projectId, memberId, this.userId(req));
  }

  private userId(req: Request) {
    return this.auth.verifyToken(this.auth.getTokenFromRequest(req));
  }
}
