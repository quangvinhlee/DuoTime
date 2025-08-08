import { Injectable, Scope, Logger } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { cleanErrorMessage } from '../utils/error-cleaner';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends PinoLogger {
  // Authentication related logs
  logAuthSuccess(
    userId: string,
    method: string,
    additionalInfo?: Record<string, any>,
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
    additionalInfo?: Record<string, any>,
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

  logDatabaseOperation(
    operation: string,
    table: string,
    duration?: number,
    additionalInfo?: Record<string, any>,
  ) {
    this.debug(
      {
        event: 'db_operation',
        operation,
        table,
        duration,
        ...additionalInfo,
      },
      `Database ${operation} on ${table}${
        duration ? ` completed in ${duration}ms` : ''
      }`,
    );
  }

  logDatabaseError(
    operation: string,
    table: string,
    error: Error,
    additionalInfo?: Record<string, any>,
  ) {
    const cleanError = cleanErrorMessage(error.message);

    this.error(
      {
        event: 'db_error',
        operation,
        table,
        error: cleanError,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'), // Limit stack trace
        ...additionalInfo,
      },
      `Database ${operation} on ${table} failed: ${cleanError}`,
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

  logBusinessEvent(
    event: string,
    details: Record<string, any>,
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

  logExternalApiCall(
    service: string,
    endpoint: string,
    method: string,
    duration?: number,
    statusCode?: number,
  ) {
    this.info(
      {
        event: 'external_api_call',
        service,
        endpoint,
        method,
        duration,
        statusCode,
      },
      `External API call to ${service} ${method} ${endpoint} ${
        statusCode ? `(${statusCode})` : ''
      } ${duration ? `in ${duration}ms` : ''}`,
    );
  }

  logExternalApiError(
    service: string,
    endpoint: string,
    method: string,
    error: Error,
    statusCode?: number,
  ) {
    const cleanError = cleanErrorMessage(error.message);

    this.error(
      {
        event: 'external_api_error',
        service,
        endpoint,
        method,
        error: cleanError,
        statusCode,
      },
      `External API call to ${service} ${method} ${endpoint} failed: ${cleanError}`,
    );
  }

  // Performance monitoring
  logPerformanceMetric(
    metric: string,
    value: number,
    unit: string,
    additionalInfo?: Record<string, any>,
  ) {
    this.info(
      {
        event: 'performance_metric',
        metric,
        value,
        unit,
        ...additionalInfo,
      },
      `Performance metric: ${metric} = ${value}${unit}`,
    );
  }

  // Security events
  logSecurityEvent(
    event: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: Record<string, any>,
  ) {
    const level =
      severity === 'critical' || severity === 'high' ? 'error' : 'warn';
    this[level](
      {
        event: 'security_event',
        securityEvent: event,
        severity,
        ...details,
      },
      `Security event (${severity}): ${event}`,
    );
  }

  // Push notification logging
  logPushNotification(
    action:
      | 'token_created'
      | 'token_updated'
      | 'token_renewed'
      | 'notification_sent'
      | 'notification_failed',
    userId: string,
    details: Record<string, any>,
  ) {
    this.info(
      {
        event: 'push_notification',
        action,
        userId,
        ...details,
      },
      `Push notification ${action} for user ${userId}`,
    );
  }
}
