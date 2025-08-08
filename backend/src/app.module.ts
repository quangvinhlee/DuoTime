import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { PubSub } from 'graphql-subscriptions';
import { join } from 'path';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PartnerBindingModule } from './partner-binding/partner-binding.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { ReminderModule } from './reminder/reminder.module';
import { GraphQLThrottlerGuard } from './common/guards/graphql-throttler.guard';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { loggerConfig } from './common/config/logger.config';
import { throttleConfig } from './common/config/throttle.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config available everywhere
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
            // Extract connection parameters for WebSocket connections
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
        // Handle both HTTP requests and WebSocket connections
        if (connection) {
          // WebSocket connection (subscriptions)
          return {
            req: {
              headers: {
                authorization: connection.context?.authorization || '',
              },
              connectionParams: connection.context,
            },
          };
        }
        // HTTP request (queries/mutations)
        return { req };
      },
    }),
    PrismaModule,
    AuthModule,
    PartnerBindingModule,
    UserModule,
    NotificationModule,
    ReminderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // Temporarily disabled to stop log spam
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: GraphQLLoggingInterceptor,
    // },
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
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
