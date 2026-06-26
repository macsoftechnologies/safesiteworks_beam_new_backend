import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Floor } from './entities/floor.entity';
import { CreateFloorDto, UpdateFloorDto, FloorQueryDto } from './dtos/floor.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private readonly floorRepo: Repository<Floor>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async create(createFloorDto: CreateFloorDto): Promise<Floor> {
    const floor = this.floorRepo.create(createFloorDto);
    const savedFloor = await this.floorRepo.save(floor);
    await this.redisCacheService.deleteByPattern('floors:*');
    return savedFloor;
  }

  async findAll(query: FloorQueryDto): Promise<any> {
    const { page = 1, limit = 10, isExport = false, bid } = query;
    return this.redisCacheService.getOrSet(
      `floors:list:${bid ?? 'all'}:${isExport}:${page}:${limit}`,
      async () => {
        const where: any = {};
        if (bid !== undefined && bid !== null) {
          where.build_id = bid;
        }

        const findOptions: any = {
          where,
          order: { fl_id: 'DESC' },
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [floors, total] = await this.floorRepo.findAndCount(findOptions);
        if (total === 0) {
          return { message: 'No Floors Found', data: [], total: 0 };
        }
        return {
          data: floors,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }

  async findOne(fl_id: number): Promise<Floor | null> {
    return this.redisCacheService.getOrSet(
      `floors:detail:${fl_id}`,
      async () => {
        return await this.floorRepo.findOne({ where: { fl_id } });
      },
      1000 * 60 * 10,
    );
  }

  async update(fl_id: number, updateFloorDto: UpdateFloorDto): Promise<Floor | null> {
    await this.floorRepo.update(fl_id, updateFloorDto);
    await this.redisCacheService.deleteByPattern('floors:*');
    return await this.findOne(fl_id);
  }

  async remove(fl_id: number): Promise<Floor | null> {
    const floor = await this.findOne(fl_id);
    if (floor) {
      await this.floorRepo.delete(fl_id);
      await this.redisCacheService.deleteByPattern('floors:*');
    }
    return floor;
  }
}
