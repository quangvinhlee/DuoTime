import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { OAuth2Client } from 'google-auth-library';
import { GoogleLoginInput } from './dtos/auth.dto';
import { JwtPayload } from '../shared/interfaces';
import { LoggerService } from '../common/services/logger.service';
import { AuthResponse } from './types/auth.types';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    // Initialize Google OAuth client
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
    // Logger context is handled by LoggerService internally
  }

  async googleLogin(googleLoginInput: GoogleLoginInput): Promise<AuthResponse> {
    const startTime = Date.now();

    try {
      this.logger.logBusinessEvent(
        'google_login_attempt',
        { idToken: '[REDACTED]' },
        'info',
      );

      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleLoginInput.idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        const error = new Error('Invalid token payload');
        this.logger.logAuthFailure('google', 'Invalid token payload');
        throw error;
      }

      const { sub: googleId, email, name, picture } = payload;

      let user = await this.prisma.user.findUnique({
        where: { googleId },
      });

      if (!user) {
        this.logger.logBusinessEvent(
          'new_user_creation',
          {
            googleId,
            email: email || '[NO_EMAIL]',
          },
          'info',
        );

        user = await this.prisma.user.create({
          data: {
            googleId,
            email: email || '',
            name,
            avatarUrl: picture,
            pushToken: googleLoginInput.pushToken || null,
          },
        });

        // Log push token creation for new user
        if (googleLoginInput.pushToken) {
          this.logger.logBusinessEvent('push_token_created', {
            userId: user.id,
            pushToken: googleLoginInput.pushToken.substring(0, 20) + '...',
            isNewUser: true,
          });
        }

        this.logger.logAuthSuccess(user.id, 'google', {
          newUser: true,
          email: user.email,
          duration: Date.now() - startTime,
        });
      } else {
        // Update push token if provided
        if (
          googleLoginInput.pushToken &&
          user.pushToken !== googleLoginInput.pushToken
        ) {
          const oldToken = user.pushToken;
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { pushToken: googleLoginInput.pushToken },
          });

          // Log push token update
          this.logger.logBusinessEvent('push_token_updated', {
            userId: user.id,
            oldToken: oldToken ? oldToken.substring(0, 20) + '...' : null,
            newToken: googleLoginInput.pushToken.substring(0, 20) + '...',
            isNewUser: false,
          });
        }

        this.logger.logAuthSuccess(user.id, 'google', {
          newUser: false,
          email: user.email,
          duration: Date.now() - startTime,
        });
      }

      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        googleId: user.googleId,
      });

      this.logger.logAuthSuccess(user.id, 'google', {
        duration: Date.now() - startTime,
      });

      return { token };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = `Google login failed: ${error}`;

      this.logger.logAuthFailure('google', errorMessage, {
        duration,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new Error(errorMessage);
    }
  }

  async renewToken(
    jwtUser: JwtPayload,
    pushToken?: string,
  ): Promise<AuthResponse> {
    this.logger.logAuthSuccess(jwtUser.id, 'token_renewal', {
      email: jwtUser.email,
    });

    // Update push token if provided
    if (pushToken) {
      const oldUser = await this.prisma.user.findUnique({
        where: { id: jwtUser.id },
        select: { pushToken: true },
      });

      await this.prisma.user.update({
        where: { id: jwtUser.id },
        data: { pushToken },
      });

      // Log push token update during renewal
      this.logger.logBusinessEvent('push_token_renewed', {
        userId: jwtUser.id,
        oldToken: oldUser?.pushToken
          ? oldUser.pushToken.substring(0, 20) + '...'
          : null,
        newToken: pushToken.substring(0, 20) + '...',
      });
    }

    const token = this.jwtService.sign(
      {
        id: jwtUser.id,
        email: jwtUser.email,
        name: jwtUser.name,
        avatarUrl: jwtUser.avatarUrl,
        googleId: jwtUser.googleId,
      },
      {
        expiresIn: '7d', // Reset to 7 days from now
      },
    );

    this.logger.info(
      { event: 'token_renewed', userId: jwtUser.id },
      `Token successfully renewed for user ${jwtUser.id}`,
    );

    return Promise.resolve({ token } as AuthResponse);
  }
}
