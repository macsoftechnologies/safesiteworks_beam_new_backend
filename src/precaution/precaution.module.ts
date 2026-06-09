import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrecautionService } from './precaution.service';
import { PrecautionController } from './precaution.controller';
import { Precaution } from './entities/precaution.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Precaution]),
    RedisModule,
  ],
  controllers: [PrecautionController],
  providers: [PrecautionService],
  exports: [PrecautionService],
})
export class PrecautionModule {}
