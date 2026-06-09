import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectricalService } from './electrical.service';
import { ElectricalController } from './electrical.controller';
import { ElectricalWork } from './entities/electrical.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElectricalWork]),
    RedisModule,
  ],
  controllers: [ElectricalController],
  providers: [ElectricalService],
  exports: [ElectricalService],
})
export class ElectricalModule {}
