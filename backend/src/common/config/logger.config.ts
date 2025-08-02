/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Params } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { cleanErrorMessage } from '../../shared/utils';

export const loggerConfig: Params = {
  pinoHttp: {
    // Custom log level - can be overridden by LOG_LEVEL env var
    level:
      process.env.LOG_LEVEL ||
      (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

    // Custom request serializer to exclude sensitive data
    serializers: {
      req: (req: any) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: {
          host: req.headers?.host,
          'user-agent': req.headers?.['user-agent'],
          'content-type': req.headers?.['content-type'],
          authorization: req.headers?.authorization ? '[REDACTED]' : undefined,
        },
        remoteAddress: req.ip,
        remotePort: req.socket?.remotePort,
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
        headers: {
          'content-type': res.getHeader?.('content-type'),
          'content-length': res.getHeader?.('content-length'),
        },
      }),
      err: (err: any) => {
        const message = cleanErrorMessage(String(err.message || ''));

        return {
          type: err.constructor?.name || 'Error',
          message,
          // Don't include stack trace in production
          ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack?.split('\n').slice(0, 3).join('\n'),
          }),
        };
      },
    },

    // Custom request ID generator
    genReqId: (req: any) =>
      (req.headers?.['x-request-id'] as string) || randomUUID(),

    // Custom log level based on status codes
    customLogLevel: function (req: any, res: any, err?: Error) {
      // Always log errors
      if (res.statusCode >= 500 || err) {
        return 'error';
      }

      // Log client errors as warnings
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      }

      // Silence redirects
      if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'silent';
      }

      // For GraphQL requests, let our custom interceptor handle the logging
      if (req.url === '/graphql' && res.statusCode === 200) {
        return 'silent';
      }

      // Log other successful requests at info level
      return 'info';
    },

    // Custom success message
    customSuccessMessage: function (req: any, res: any) {
      if (res.statusCode === 404) {
        return 'Resource not found';
      }
      return `${req.method} ${req.url}`;
    },

    // Custom error message
    customErrorMessage: function (req: any, res: any, err: Error) {
      const message = cleanErrorMessage(err.message);
      return `${req.method} ${req.url} - ${message}`;
    },

    // Transport for development (pretty printing)
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              levelFirst: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss.l',
              messageFormat:
                '{level} [{context}] {msg} | {req.method} {req.url} {res.statusCode} - {responseTime}ms',
              ignore:
                'pid,hostname,req.headers.host,req.headers.user-agent,req.headers.content-type,req.id,req.remoteAddress,req.remotePort,res.headers',
              hideObject: false, // Show structured data
              singleLine: false, // Allow multi-line for better readability
            },
          }
        : undefined,

    // Base logger configuration
    base: {
      service: 'duotime-backend',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },

    // Timestamp format
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
};
