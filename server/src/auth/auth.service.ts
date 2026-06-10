import { Injectable, UnauthorizedException } from '@nestjs/common';
import { google } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import type { IncomingHttpHeaders } from 'http';
import { PrismaService } from '../prisma/prisma.service';

interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
}

@Injectable()
export class AuthService {
  private readonly cookieName = 'doit_token';

  constructor(private readonly prisma: PrismaService) {}

  getGoogleAuthUrl() {
    const client = this.getOAuthClient();

    return client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });
  }

  async handleGoogleCallback(code: string) {
    const client = this.getOAuthClient();
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();
    const profile = data as GoogleProfile;

    if (!profile.email) {
      throw new UnauthorizedException('Google account has no email.');
    }

    const user = await this.prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: profile.name,
        avatarUrl: profile.picture ?? null,
        googleAccountId: profile.id,
        googleAccessToken: tokens.access_token ?? undefined,
        googleRefreshToken: tokens.refresh_token ?? undefined,
      },
      create: {
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture ?? null,
        googleAccountId: profile.id,
        googleAccessToken: tokens.access_token ?? null,
        googleRefreshToken: tokens.refresh_token ?? null,
      },
    });

    return {
      token: this.signUserToken(user.id),
      user,
    };
  }

  signUserToken(userId: string) {
    return jwt.sign({ sub: userId }, this.jwtSecret, { expiresIn: '7d' });
  }

  verifyToken(token?: string) {
    if (!token) {
      throw new UnauthorizedException('Missing auth token.');
    }

    try {
      const payload = jwt.verify(token, this.jwtSecret) as { sub?: string };
      if (!payload.sub) {
        throw new UnauthorizedException('Invalid auth token.');
      }
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid auth token.');
    }
  }

  getTokenFromRequest(req: { headers?: IncomingHttpHeaders; cookies?: Record<string, string> }) {
    const header = req.headers?.authorization;
    const bearer =
      typeof header === 'string' && header.startsWith('Bearer ')
        ? header.slice('Bearer '.length)
        : undefined;

    return bearer ?? req.cookies?.[this.cookieName];
  }

  getCookieName() {
    return this.cookieName;
  }

  private getOAuthClient() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:3333/auth/google/callback',
    );
  }

  private get jwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not configured.');
    }
    return secret;
  }
}
