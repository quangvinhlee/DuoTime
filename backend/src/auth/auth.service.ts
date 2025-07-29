import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { GoogleLoginInput } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Initialize Google OAuth client
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

  async googleLogin(googleLoginInput: GoogleLoginInput): Promise<User | null> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleLoginInput.idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      const { sub: googleId, email, name, picture } = payload;

      let user = await this.prisma.user.findUnique({
        where: { googleId },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            googleId,
            email: email || '',
            name,
            avatarUrl: picture,
          },
        });
      }

      return user;
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }
}
