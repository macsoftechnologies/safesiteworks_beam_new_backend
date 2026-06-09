import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectricalWork } from './entities/electrical.entity';
import { CreateElectricalDto, UpdateElectricalDto, ElectricalQueryDto } from './dtos/electrical.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';

@Injectable()
export class ElectricalService {
  constructor(
    @InjectRepository(ElectricalWork)
    private readonly electricalRepo: Repository<ElectricalWork>,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async create(createElectricalDto: CreateElectricalDto): Promise<ElectricalWork> {
    const electrical = this.electricalRepo.create(createElectricalDto);
    const savedElectrical = await this.electricalRepo.save(electrical);
    await this.redisCacheService.deleteByPattern('electrical:*');
    return savedElectrical;
  }

  async findAll(query: ElectricalQueryDto): Promise<any> {
    const { page = 1, limit = 10, isExport = false, module } = query;
    return this.redisCacheService.getOrSet(
      `electrical:list:${module ?? 'all'}:${isExport}:${page}:${limit}`,
      async () => {
        const where: any = {};
        if (module) {
          where.module = module;
        }

        const findOptions: any = {
          where,
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }

        const [electricalWorks, total] = await this.electricalRepo.findAndCount(findOptions);
        
        if (total === 0) {
          return { message: 'No Electrical Works Found', data: [], total: 0 };
        }

        return {
          data: electricalWorks,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }

  async findOne(id: number): Promise<ElectricalWork | null> {
    return this.redisCacheService.getOrSet(
      `electrical:detail:${id}`,
      async () => {
        return await this.electricalRepo.findOne({
          where: { id },
        });
      },
      1000 * 60 * 10,
    );
  }

  async update(id: number, updateElectricalDto: UpdateElectricalDto): Promise<ElectricalWork | null> {
    await this.electricalRepo.update(id, updateElectricalDto);
    await this.redisCacheService.deleteByPattern('electrical:*');
    return await this.findOne(id);
  }

  async remove(id: number): Promise<ElectricalWork | null> {
    const electrical = await this.findOne(id);
    if (electrical) {
      await this.electricalRepo.delete(id);
      await this.redisCacheService.deleteByPattern('electrical:*');
    }
    return electrical;
  }
}
