import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';
import { CreateBuildingDto, UpdateBuildingDto, BuildingQueryDto } from './dtos/building.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepo: Repository<Building>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const building = this.buildingRepo.create(createBuildingDto);
    const savedBuilding = await this.buildingRepo.save(building);
    await this.redisCacheService.deleteByPattern('buildings:*');
    return savedBuilding;
  }

  async findAll(query: BuildingQueryDto): Promise<any> {
    const { page = 1, limit = 10, isExport = false, siteid } = query;
    return this.redisCacheService.getOrSet(
      `buildings:list:${siteid ?? 'all'}:${isExport}:${page}:${limit}`,
      async () => {
        const where: any = {};
        if (siteid !== undefined && siteid !== null) {
          where.site_id = siteid;
        }

        const findOptions: any = { where };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [buildings, total] = await this.buildingRepo.findAndCount(findOptions);
        if (total === 0) {
          return { message: 'No Buildings Found', data: [], total: 0 };
        }
        return {
          data: buildings,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }

  async findOne(build_id: number): Promise<Building | null> {
    return this.redisCacheService.getOrSet(
      `buildings:detail:${build_id}`,
      async () => {
        return await this.buildingRepo.findOne({ where: { build_id } });
      },
      1000 * 60 * 10,
    );
  }

  async update(build_id: number, updateBuildingDto: UpdateBuildingDto): Promise<Building | null> {
    await this.buildingRepo.update(build_id, updateBuildingDto);
    await this.redisCacheService.deleteByPattern('buildings:*');
    return await this.findOne(build_id);
  }

  async remove(build_id: number): Promise<Building | null> {
    const building = await this.findOne(build_id);
    if (building) {
      await this.buildingRepo.delete(build_id);
      await this.redisCacheService.deleteByPattern('buildings:*');
    }
    return building;
  }
}
