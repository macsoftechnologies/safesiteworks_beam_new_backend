import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcontractorService } from './subcontractor.service';
import { SubcontractorController } from './subcontractor.controller';
import { FileUploadService } from './file-upload.service';
import { Subcontractor } from './entities/subcontractor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subcontractor])],
  controllers: [SubcontractorController],
  providers: [SubcontractorService, FileUploadService],
  exports: [SubcontractorService],
})
export class SubcontractorModule {}
