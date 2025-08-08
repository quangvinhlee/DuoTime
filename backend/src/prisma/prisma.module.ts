import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SharedServicesModule } from '../common/services/shared-services.module';

@Global()
@Module({
  imports: [SharedServicesModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
