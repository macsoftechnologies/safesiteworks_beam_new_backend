import { Test, TestingModule } from '@nestjs/testing';
import { SubcontractorService } from './subcontractor.service';

describe('SubcontractorService', () => {
  let service: SubcontractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubcontractorService],
    }).compile();

    service = module.get<SubcontractorService>(SubcontractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
