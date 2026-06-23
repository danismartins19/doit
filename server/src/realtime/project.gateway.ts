import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

interface PresenceUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface ProjectTaskEvent {
  action: 'created' | 'updated' | 'deleted' | 'moved' | 'status-changed' | 'responsible-changed';
  projectId: string;
  taskId: string;
  task?: unknown;
  actor: PresenceUser;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
})
export class ProjectGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly presence = new Map<string, Map<string, PresenceUser>>();

  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(socket: Socket) {
    const user = await this.resolveSocketUser(socket).catch(() => null);

    if (!user) {
      socket.disconnect(true);
      return;
    }

    socket.data.user = user;
    socket.emit('auth:ready', user);
  }

  handleDisconnect(socket: Socket) {
    for (const [projectId, usersBySocket] of this.presence.entries()) {
      if (usersBySocket.delete(socket.id)) {
        this.emitPresence(projectId);
      }

      if (usersBySocket.size === 0) {
        this.presence.delete(projectId);
      }
    }
  }

  @SubscribeMessage('project:join')
  async joinProject(@ConnectedSocket() socket: Socket, @MessageBody() body: { projectId: string }) {
    const user = socket.data.user as PresenceUser | undefined;

    if (!user || !body?.projectId) {
      socket.emit('project:error', { message: 'Invalid project join payload.' });
      return;
    }

    const member = await this.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: body.projectId, userId: user.id } },
    });

    if (!member) {
      socket.emit('project:error', { message: 'You are not a member of this project.' });
      return;
    }

    const room = this.projectRoom(body.projectId);
    await socket.join(room);

    if (!this.presence.has(body.projectId)) {
      this.presence.set(body.projectId, new Map());
    }

    this.presence.get(body.projectId)?.set(socket.id, user);
    this.emitPresence(body.projectId);
  }

  @SubscribeMessage('project:leave')
  async leaveProject(@ConnectedSocket() socket: Socket, @MessageBody() body: { projectId: string }) {
    if (!body?.projectId) {
      return;
    }

    await socket.leave(this.projectRoom(body.projectId));
    this.presence.get(body.projectId)?.delete(socket.id);
    this.emitPresence(body.projectId);
  }

  broadcastTaskEvent(event: ProjectTaskEvent) {
    this.server.to(this.projectRoom(event.projectId)).emit('task:changed', event);
  }

  private emitPresence(projectId: string) {
    const users = Array.from(this.presence.get(projectId)?.values() ?? []);
    const uniqueUsers = Array.from(new Map(users.map((user) => [user.id, user])).values());

    this.server.to(this.projectRoom(projectId)).emit('project:presence', {
      projectId,
      users: uniqueUsers,
    });
  }

  private async resolveSocketUser(socket: Socket): Promise<PresenceUser> {
    const token =
      typeof socket.handshake.auth?.token === 'string'
        ? socket.handshake.auth.token
        : this.getBearerToken(socket) ?? this.getCookieToken(socket);
    const userId = this.auth.verifyToken(token);

    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatarUrl: true },
    });
  }

  private getBearerToken(socket: Socket) {
    const header = socket.handshake.headers.authorization;

    return typeof header === 'string' && header.startsWith('Bearer ')
      ? header.slice('Bearer '.length)
      : undefined;
  }

  private getCookieToken(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;

    return cookie
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${this.auth.getCookieName()}=`))
      ?.split('=')
      .slice(1)
      .join('=');
  }

  private projectRoom(projectId: string) {
    return `project:${projectId}`;
  }
}
