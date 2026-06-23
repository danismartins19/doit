import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './authenticated-request';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = this.auth.verifyToken(this.auth.getTokenFromRequest(request));

    (request as AuthenticatedRequest).user = { id: userId };

    return true;
  }
}
