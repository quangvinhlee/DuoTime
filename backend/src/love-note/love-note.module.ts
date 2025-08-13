import { Module } from '@nestjs/common';
import { LoveNoteService } from './love-note.service';
import { LoveNoteResolver } from './love-note.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [LoveNoteService, LoveNoteResolver],
  exports: [LoveNoteService],
})
export class LoveNoteModule {}
