import { Test, TestingModule } from '@nestjs/testing';
import { PartnerBindingResolver } from './partner-binding.resolver';
import { PartnerBindingService } from './partner-binding.service';

describe('PartnerBindingResolver', () => {
  let resolver: PartnerBindingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerBindingResolver, PartnerBindingService],
    }).compile();

    resolver = module.get<PartnerBindingResolver>(PartnerBindingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
