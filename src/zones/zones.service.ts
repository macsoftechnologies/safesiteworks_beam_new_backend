import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone } from './entities/zone.entity';
import { CreateZoneDto, UpdateZoneDto, ZonesQueryDto } from './dtos/zone.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(Zone)
    private readonly zonesRepo: Repository<Zone>,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    const zone = this.zonesRepo.create(createZoneDto);
    const savedZone = await this.zonesRepo.save(zone);

    await this.redisCacheService.deleteByPattern('zones:*');
    return savedZone;
  }

  async findAll(query: ZonesQueryDto): Promise<any> {
    const { page = 1, limit = 10, isExport = false, level, building_id, zone } = query;
    return this.redisCacheService.getOrSet(
      `zones:list:${level ?? 'all'}:${building_id ?? 'all'}:${zone ?? 'all'}:${isExport}:${page}:${limit}`,
      async () => {
        const where: any = {};
        if (level) {
          where.level = level;
        }
        if (building_id !== undefined && building_id !== null) {
          where.building_id = building_id;
        }
        if (zone) {
          where.zone = zone;
        }

        const findOptions: any = {
          where,
          relations: { floor: true },
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [zones, total] = await this.zonesRepo.findAndCount(findOptions);
        if (total === 0) {
          return { message: 'No Zones Found', data: [], total: 0 };
        }
        return {
          statusCode: HttpStatus.OK,
          data: zones,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }

  async findOne(id: number): Promise<Zone | null> {
    return this.redisCacheService.getOrSet(
      `zones:detail:${id}`,
      async () => {
        return await this.zonesRepo.findOne({
          where: { id },
          relations: { floor: true },
        });
      },
      1000 * 60 * 10,
    );
  }

  async update(id: number, updateZoneDto: UpdateZoneDto): Promise<Zone | null> {
    await this.zonesRepo.update(id, updateZoneDto);
    await this.redisCacheService.deleteByPattern('zones:*');
    return await this.findOne(id);
  }

  async remove(id: number): Promise<Zone | null> {
    const zone = await this.findOne(id);
    if (zone) {
      await this.zonesRepo.delete(id);
      await this.redisCacheService.deleteByPattern('zones:*');
    }
    return zone;
  }
}
