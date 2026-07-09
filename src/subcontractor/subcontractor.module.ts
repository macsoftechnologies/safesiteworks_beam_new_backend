import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcontractorService } from './subcontractor.service';
import { SubcontractorController } from './subcontractor.controller';
import { FileUploadService } from './file-upload.service';
import { Subcontractor } from './entities/subcontractor.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subcontractor, User])],
  controllers: [SubcontractorController],
  providers: [SubcontractorService, FileUploadService],
  exports: [SubcontractorService],
})
export class SubcontractorModule {}
