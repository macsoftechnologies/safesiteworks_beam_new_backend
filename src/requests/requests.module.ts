import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

import { RequestEntity } from './entities/request.entity';
import {
  RequestChemicalHazard,
  RequestConfined,
  RequestElectrical,
  RequestEnergisingElectrical,
  RequestEnergisingMechanical,
  RequestExcavation,
  RequestExtraMisc,
  RequestFireHotwork,
  RequestGeneral,
  RequestHeight,
  RequestLifting,
  RequestPpe,
  RequestPressureTesting
} from './entities/request-subtables.entity';
import { RamsFile, RequestNote, UploadImage, RequestLog, RequestLogData, CompleteLog } from './entities/supporting.entity';

import { Building } from '../building/entities/building.entity';
import { Floor } from '../floor/entities/floor.entity';
import { Zone } from '../zones/entities/zone.entity';
import { Room } from '../room/entities/room.entity';
import { Subcontractor } from '../subcontractor/entities/subcontractor.entity';
import { Activity } from '../activities/entities/activity.entity';
import { User } from '../users/entities/user.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Department } from '../department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestEntity,
      RequestChemicalHazard,
      RequestConfined,
      RequestElectrical,
      RequestEnergisingElectrical,
      RequestEnergisingMechanical,
      RequestExcavation,
      RequestExtraMisc,
      RequestFireHotwork,
      RequestGeneral,
      RequestHeight,
      RequestLifting,
      RequestPpe,
      RequestPressureTesting,

      RamsFile,
      RequestNote,
      UploadImage,
      RequestLog,
      RequestLogData,
      CompleteLog,

      Building,
      Floor,
      Zone,
      Room,
      Subcontractor,
      Activity,
      User,
      Employee,
      Department,
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
