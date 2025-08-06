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
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { pushToken: googleLoginInput.pushToken },
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
    this.logger.logAuthSuccess(jwtUser.sub, 'token_renewal', {
      email: jwtUser.email,
    });

    // Update push token if provided
    if (pushToken) {
      await this.prisma.user.update({
        where: { id: jwtUser.sub },
        data: { pushToken },
      });
    }

    const token = this.jwtService.sign(
      {
        sub: jwtUser.sub,
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
      { event: 'token_renewed', userId: jwtUser.sub },
      `Token successfully renewed for user ${jwtUser.sub}`,
    );

    return Promise.resolve({ token } as AuthResponse);
  }
}
