import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../shared/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET', { infer: true });
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: (req) => {
        // Handle WebSocket connections (subscriptions)
        if (req?.connectionParams?.authorization) {
          const authHeader = req.connectionParams.authorization;
          if (authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
          }
          return authHeader;
        }

        // Handle HTTP requests
        if (req?.headers?.authorization) {
          const authHeader = req.headers.authorization;
          if (authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
          }
          return authHeader;
        }

        return null;
      },
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.avatarUrl,
      googleId: payload.googleId,
    };
  }
}
