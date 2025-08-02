/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { throwError } from 'rxjs';

@Injectable()
export class GraphQLLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const request = gqlContext.getContext().req;

    const operationType = info.operation.operation as string;
    const operationName = info.operation.name?.value as string | undefined;
    const fieldName = info.fieldName as string;
    const userId = request.user?.sub as string | undefined;

    if (this.isIntrospectionQuery(fieldName, operationName)) {
      return next.handle();
    }

    if (!this.isBusinessOperation(operationType, operationName, fieldName)) {
      return next.handle();
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.logGraphQLOperation(
          operationType,
          operationName || fieldName,
          duration,
          userId,
        );
      }),
      catchError((error: Error) => {
        this.logger.logGraphQLError(
          operationType,
          operationName || fieldName,
          error,
          userId,
        );
        return throwError(() => error);
      }),
    );
  }

  private isIntrospectionQuery(
    fieldName: string,
    operationName?: string,
  ): boolean {
    const introspectionFields = [
      '__schema',
      '__type',
      '__typename',
      '__Field',
      '__EnumValue',
      '__InputValue',
      '__Directive',
    ];

    const introspectionOperations = [
      'IntrospectionQuery',
      'GetSchema',
      'GetIntrospection',
    ];

    return (
      introspectionFields.includes(fieldName) ||
      Boolean(operationName && introspectionOperations.includes(operationName))
    );
  }

  private isBusinessOperation(
    operationType: string,
    operationName?: string,
    fieldName?: string,
  ): boolean {
    if (operationType === 'mutation') {
      return true;
    }

    if (operationType === 'query') {
      const systemQueries = ['node', 'viewer', '__schema', '__type'];

      const queryName = operationName || fieldName;
      if (!queryName) return false;

      // Skip system queries (case-insensitive)
      const isSystemQuery = systemQueries.some(
        (sysQuery) => sysQuery.toLowerCase() === queryName.toLowerCase(),
      );

      // Log all queries except system queries
      return !isSystemQuery;
    }

    return false;
  }
}
