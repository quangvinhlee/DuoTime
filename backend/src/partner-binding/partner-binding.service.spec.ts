import { Test, TestingModule } from '@nestjs/testing';
import { PartnerBindingService } from './partner-binding.service';

describe('PartnerBindingService', () => {
  let service: PartnerBindingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerBindingService],
    }).compile();

    service = module.get<PartnerBindingService>(PartnerBindingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
