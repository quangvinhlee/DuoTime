import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule } from '@nestjs/throttler';
import { PubSub } from 'graphql-subscriptions';
import { join } from 'path';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PartnerBindingModule } from './partner-binding/partner-binding.module';
import { UserResolver } from './shared/resolver-field/user.resolver';
import { UserModule } from './user/user.module';
import { SecurityMiddleware } from './common/middleware/security.middleware';
import { loggerConfig } from './common/config/logger.config';
import { throttleConfig } from './common/config/throttle.config';
import { LoggerService } from './common/services/logger.service';
// import { GraphQLLoggingInterceptor } from './common/interceptors/graphql-logging.interceptor';
import { GraphQLThrottlerGuard } from './common/guards/graphql-throttler.guard';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config available everywhere
      envFilePath: '.env',
    }),
    LoggerModule.forRoot(loggerConfig),
    ThrottlerModule.forRoot(throttleConfig),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      sortSchema: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      installSubscriptionHandlers: true,
    }),
    PrismaModule,
    AuthModule,
    PartnerBindingModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    AppResolver,
    UserResolver,
    LoggerService,
    // Add PubSub provider directly here
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
