import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { UserLog } from './entities/userlog.entity';
import { User } from '../users/entities/user.entity';
import { Subcontractor } from '../subcontractor/entities/subcontractor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, UserLog, User, Subcontractor]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
