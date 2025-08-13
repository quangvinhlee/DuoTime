import { Injectable, Scope, Logger } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { cleanErrorMessage } from '../utils/error-cleaner';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends PinoLogger {
  logAuthSuccess(
    userId: string,
    method: string,
    additionalInfo?: Record<string, unknown>,
  ) {
    this.info(
      {
        event: 'auth_success',
        userId,
        method,
        ...additionalInfo,
      },
      `Authentication successful for user ${userId} via ${method}`,
    );
  }

  logAuthFailure(
    method: string,
    reason: string,
    additionalInfo?: Record<string, unknown>,
  ) {
    const cleanReason = cleanErrorMessage(reason);

    this.warn(
      {
        event: 'auth_failure',
        method,
        reason: cleanReason,
        ...additionalInfo,
      },
      `Authentication failed via ${method}: ${cleanReason}`,
    );
  }

  logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: Record<string, unknown>,
  ) {
    this.warn(
      {
        event: 'security_event',
        securityEvent: event,
        severity,
        ...details,
      },
      `Security event: ${event} (${severity} severity)`,
    );
  }

  logDatabaseOperation(operation: string, table: string, duration: number) {
    this.info(
      {
        event: 'database_operation',
        operation,
        table,
        duration,
      },
      `Database ${operation} on ${table} completed in ${duration}ms`,
    );
  }

  logDatabaseError(operation: string, table: string, error: Error) {
    const cleanError = cleanErrorMessage(error.message);

    this.error(
      {
        event: 'database_error',
        operation,
        table,
        error: cleanError,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      },
      `Database ${operation} on ${table} failed: ${cleanError}`,
    );
  }

  logBusinessEvent(
    event: string,
    details: Record<string, unknown>,
    level: 'info' | 'warn' | 'error' = 'info',
  ) {
    this[level](
      {
        event: 'business_event',
        eventType: event,
        ...details,
      },
      `Business event: ${event}`,
    );
  }

  logGraphQLOperation(
    operationType: string,
    operationName?: string,
    duration?: number,
    userId?: string,
  ) {
    this.info(
      {
        event: 'graphql_operation',
        operationType,
        operationName,
        duration,
        userId,
      },
      `GraphQL ${operationType}${
        operationName ? ` (${operationName})` : ''
      } ${duration ? `completed in ${duration}ms` : ''}`,
    );
  }

  logGraphQLError(
    operationType: string,
    operationName: string | undefined,
    error: Error,
    userId?: string,
  ) {
    const cleanError = cleanErrorMessage(error.message);

    this.error(
      {
        event: 'graphql_error',
        operationType,
        operationName,
        error: cleanError,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
        userId,
      },
      `GraphQL ${operationType}${
        operationName ? ` (${operationName})` : ''
      } failed: ${cleanError}`,
    );
  }
}
