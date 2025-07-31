import { Module } from '@nestjs/common';
import { PartnerBindingService } from './partner-binding.service';
import { PartnerBindingResolver } from './partner-binding.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PartnerBindingResolver, PartnerBindingService],
})
export class PartnerBindingModule {}
