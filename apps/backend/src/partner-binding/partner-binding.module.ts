import { Module } from '@nestjs/common';
import { PartnerBindingService } from './partner-binding.service';
import { PartnerBindingResolver } from './partner-binding.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [PartnerBindingResolver, PartnerBindingService],
})
export class PartnerBindingModule {}
