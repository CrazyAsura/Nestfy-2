import { Test, TestingModule } from '@nestjs/testing';
import { RisksResolver } from './risks.resolver';
import { RisksService } from './risks.service';

describe('RisksResolver', () => {
  let resolver: RisksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RisksResolver, RisksService],
    }).compile();

    resolver = module.get<RisksResolver>(RisksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
