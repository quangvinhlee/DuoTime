/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Optional,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../../shared/interfaces';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Optional() private readonly logger?: LoggerService) {
    super();
    // Logger context is handled by LoggerService internally
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Ensure we always return a valid request object
    if (!request) {
      throw new UnauthorizedException('Request context not available');
    }

    return request as Request;
  }

  handleRequest<TUser = JwtPayload>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const gqlInfo = gqlContext.getInfo();

    const operationType = gqlInfo?.operation?.operation as string;
    const operationName =
      (gqlInfo?.operation?.name?.value as string) ||
      (gqlInfo?.fieldName as string);
    const userAgent = request?.headers?.['user-agent'] as string;
    const ip = request?.ip as string;

    if (err || !user) {
      // Log authentication failure
      if (this.logger) {
        this.logger.logAuthFailure('jwt', 'Authentication required', {
          operation: operationName,
          operationType,
          ip,
          userAgent,
          error: err?.message || 'No valid JWT token provided',
          reason: info?.message || 'Missing or invalid token',
        });

        this.logger.logSecurityEvent('unauthorized_access_attempt', 'medium', {
          operation: operationName,
          operationType,
          ip,
          userAgent,
          reason: info?.message || 'Missing or invalid token',
        });
      }

      throw err || new UnauthorizedException('Authentication required');
    }

    // Log successful authentication
    const jwtUser = user as unknown as JwtPayload;
    if (this.logger) {
      this.logger.logAuthSuccess(jwtUser.id, 'jwt', {
        operation: operationName,
        operationType,
      });
    }

    return user;
  }
}
