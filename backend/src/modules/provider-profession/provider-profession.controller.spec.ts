import { Test, TestingModule } from '@nestjs/testing';
import { ProviderProfessionController } from './provider-profession.controller';

describe('ProviderProfessionController', () => {
  let controller: ProviderProfessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderProfessionController],
    }).compile();

    controller = module.get<ProviderProfessionController>(ProviderProfessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
