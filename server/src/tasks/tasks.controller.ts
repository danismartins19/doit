import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { TaskStatus } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { OkResponseDto, TaskResponseDto } from '../common/dto';
import {
  CreateTaskDto,
  MoveTaskDto,
  UpdateTaskDto,
  UpdateTaskResponsibleDto,
  UpdateTaskStatusDto,
} from './tasks.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller()
export class TasksController {
  constructor(
    private readonly auth: AuthService,
    private readonly tasks: TasksService,
  ) {}

  @Get('projects/:projectId/tasks')
  @ApiOperation({ summary: 'List tasks by project' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiOkResponse({ type: [TaskResponseDto] })
  list(@Req() req: Request, @Param('projectId') projectId: string, @Query('status') status?: TaskStatus) {
    return this.tasks.list(projectId, this.userId(req), status);
  }

  @Post('projects/:projectId/tasks')
  @ApiOperation({ summary: 'Create task' })
  @ApiCreatedResponse({ type: TaskResponseDto })
  create(@Req() req: Request, @Param('projectId') projectId: string, @Body() body: CreateTaskDto) {
    return this.tasks.create(projectId, this.userId(req), body);
  }

  @Get('tasks/:taskId')
  @ApiOperation({ summary: 'Get task' })
  @ApiOkResponse({ type: TaskResponseDto })
  get(@Req() req: Request, @Param('taskId') taskId: string) {
    return this.tasks.get(taskId, this.userId(req));
  }

  @Patch('tasks/:taskId')
  @ApiOperation({ summary: 'Update task' })
  @ApiOkResponse({ type: TaskResponseDto })
  update(@Req() req: Request, @Param('taskId') taskId: string, @Body() body: UpdateTaskDto) {
    return this.tasks.update(taskId, this.userId(req), body);
  }

  @Delete('tasks/:taskId')
  @ApiOperation({ summary: 'Delete task' })
  @ApiOkResponse({ type: OkResponseDto })
  delete(@Req() req: Request, @Param('taskId') taskId: string) {
    return this.tasks.delete(taskId, this.userId(req));
  }

  @Patch('tasks/:taskId/move')
  @ApiOperation({ summary: 'Move task to another day or order' })
  @ApiOkResponse({ type: TaskResponseDto })
  move(@Req() req: Request, @Param('taskId') taskId: string, @Body() body: MoveTaskDto) {
    return this.tasks.move(taskId, this.userId(req), body);
  }

  @Patch('tasks/:taskId/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiOkResponse({ type: TaskResponseDto })
  status(@Req() req: Request, @Param('taskId') taskId: string, @Body() body: UpdateTaskStatusDto) {
    return this.tasks.status(taskId, this.userId(req), body.status);
  }

  @Patch('tasks/:taskId/responsible')
  @ApiOperation({ summary: 'Update task responsible user' })
  @ApiOkResponse({ type: TaskResponseDto })
  responsible(@Req() req: Request, @Param('taskId') taskId: string, @Body() body: UpdateTaskResponsibleDto) {
    return this.tasks.responsible(taskId, this.userId(req), body.responsibleId);
  }

  private userId(req: Request) {
    return this.auth.verifyToken(this.auth.getTokenFromRequest(req));
  }
}
