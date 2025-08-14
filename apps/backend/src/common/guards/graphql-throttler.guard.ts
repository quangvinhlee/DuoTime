/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class GraphQLThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
    private readonly logger: LoggerService,
  ) {
    super(options, storageService, reflector);
  }

  getRequestResponse(context: ExecutionContext): {
    req: Record<string, any>;
    res: Record<string, any>;
  } {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    // Extract request from GraphQL context
    const originalReq = ctx.req || ctx.request;

    if (!originalReq) {
      this.logger.logSecurityEvent('throttle_guard_error', 'high', {
        error: 'No request object found in GraphQL context',
      });
      // Return fallback objects instead of null
      return {
        req: { ip: '127.0.0.1', url: '/graphql', method: 'POST', headers: {} },
        res: {
          header: () => undefined,
          status: () => undefined,
          send: () => undefined,
          end: () => undefined,
          setHeader: () => undefined,
          getHeader: () => undefined,
          statusCode: 200,
          headersSent: false,
        },
      };
    }

    // Ensure request has all required properties for ThrottlerGuard
    const req = {
      ...originalReq,
      ip:
        originalReq.ip ||
        originalReq.connection?.remoteAddress ||
        originalReq.socket?.remoteAddress ||
        (originalReq.headers?.['x-forwarded-for'] as string)
          ?.split(',')[0]
          ?.trim() ||
        originalReq.headers?.['x-real-ip'] ||
        '127.0.0.1',
      url: originalReq.url || '/graphql',
      method: originalReq.method || 'POST',
      headers: originalReq.headers || {},
    };

    // Create a mock response object that satisfies ThrottlerGuard requirements
    const res = {
      header: () => res,
      status: () => res,
      send: () => res,
      end: () => res,
      setHeader: () => res,
      getHeader: () => undefined,
      statusCode: 200,
      headersSent: false,
    };

    return { req, res };
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();

    // Skip throttling for introspection queries
    const fieldName = info.fieldName as string;
    const introspectionFields = [
      '__schema',
      '__type',
      '__typename',
      '__Field',
      '__EnumValue',
      '__InputValue',
      '__Directive',
    ];

    return Promise.resolve(introspectionFields.includes(fieldName));
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Return the IP directly since we've already set it in getRequestResponse
    return Promise.resolve(req.ip || '127.0.0.1');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canActivate = await super.canActivate(context);

      if (!canActivate) {
        // Log rate limit exceeded
        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();
        const { req } = this.getRequestResponse(context);

        this.logger.logSecurityEvent('rate_limit_exceeded', 'high', {
          ip: req?.ip,
          userAgent: req?.headers?.['user-agent'],
          userId: req?.user?.sub,
          operationType: info.operation.operation,
          operationName: info.operation.name?.value,
          fieldName: info.fieldName,
        });
      }

      return canActivate;
    } catch (error) {
      // Log error and fail secure - block the request
      this.logger.logSecurityEvent('throttle_guard_error', 'high', {
        error: error instanceof Error ? error.message : String(error),
      });

      // Return false to block the request when there's an error
      return false;
    }
  }
}
