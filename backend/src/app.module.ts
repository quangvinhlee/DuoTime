import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { APP_PIPE, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PartnerBindingModule } from './partner-binding/partner-binding.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { ReminderModule } from './reminder/reminder.module';
import { LoveNoteModule } from './love-note/love-note.module';
import { GraphQLThrottlerGuard } from './common/guards/graphql-throttler.guard';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { loggerConfig } from './common/config/logger.config';
import { throttleConfig } from './common/config/throttle.config';
import { GraphQLLoggingInterceptor } from './common/interceptors/graphql-logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot(loggerConfig),
    ThrottlerModule.forRoot(throttleConfig),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT as string) || 6379,
        password: process.env.REDIS_PASSWORD || 'duotime2024',
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      sortSchema: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      subscriptions: {
        'graphql-ws': {
          onConnect: (context) => {
            const { connectionParams } = context;
            return {
              req: {
                headers: {
                  authorization: connectionParams?.authorization || '',
                },
                connectionParams,
              },
            };
          },
        },
      },
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => {
        if (connection) {
          return {
            req: {
              headers: {
                authorization: connection.context?.authorization || '',
              },
              connectionParams: connection.context,
            },
          };
        }
        return { req };
      },
    }),
    PrismaModule,
    AuthModule,
    PartnerBindingModule,
    UserModule,
    NotificationModule,
    ReminderModule,
    LoveNoteModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GraphQLLoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
