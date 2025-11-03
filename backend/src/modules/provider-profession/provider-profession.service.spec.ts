import { Test, TestingModule } from '@nestjs/testing';
import { ProviderProfessionService } from './provider-profession.service';

describe('ProviderProfessionService', () => {
  let service: ProviderProfessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderProfessionService],
    }).compile();

    service = module.get<ProviderProfessionService>(ProviderProfessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
