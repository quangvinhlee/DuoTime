import { Test, TestingModule } from '@nestjs/testing';
import { ReminderResolver } from './reminder.resolver';
import { ReminderService } from './reminder.service';

describe('ReminderResolver', () => {
  let resolver: ReminderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderResolver, ReminderService],
    }).compile();

    resolver = module.get<ReminderResolver>(ReminderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
