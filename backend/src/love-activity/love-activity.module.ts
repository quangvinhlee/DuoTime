import { Module } from '@nestjs/common';
import { LoveActivityService } from './love-activity.service';
import { LoveActivityResolver } from './love-activity.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [LoveActivityService, LoveActivityResolver],
  exports: [LoveActivityService],
})
export class LoveActivityModule {}
