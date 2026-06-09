import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicalService } from './mechanical.service';
import { MechanicalController } from './mechanical.controller';
import { MechanicalWork } from './entities/mechanical.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MechanicalWork]),
    RedisModule,
  ],
  controllers: [MechanicalController],
  providers: [MechanicalService],
  exports: [MechanicalService],
})
export class MechanicalModule {}
