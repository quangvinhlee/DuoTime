import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../common/services/redis.service';

@Controller()
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Get('health')
  async health() {
    const checks = {
      database: 'unknown' as 'ok' | 'error' | 'unknown',
      redis: 'unknown' as 'ok' | 'error' | 'unknown',
    };

    try {
      // Simple DB connectivity check
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch {
      checks.database = 'error';
    }

    try {
      const client = this.redisService.getRedisClient();
      const pong = await client.ping();
      checks.redis = pong === 'PONG' ? 'ok' : 'error';
    } catch {
      checks.redis = 'error';
    }

    return {
      status:
        checks.database === 'ok' && checks.redis === 'ok' ? 'ok' : 'degraded',
      time: new Date().toISOString(),
      checks,
    };
  }
}
