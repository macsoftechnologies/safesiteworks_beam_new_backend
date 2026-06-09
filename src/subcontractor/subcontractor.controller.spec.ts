import { Test, TestingModule } from '@nestjs/testing';
import { SubcontractorController } from './subcontractor.controller';
import { SubcontractorService } from './subcontractor.service';

describe('SubcontractorController', () => {
  let controller: SubcontractorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcontractorController],
      providers: [SubcontractorService],
    }).compile();

    controller = module.get<SubcontractorController>(SubcontractorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
