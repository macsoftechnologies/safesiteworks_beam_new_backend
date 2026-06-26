import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MechanicalWork } from './entities/mechanical.entity';
import { CreateMechanicalDto, UpdateMechanicalDto, MechanicalQueryDto } from './dtos/mechanical.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';

@Injectable()
export class MechanicalService {
  constructor(
    @InjectRepository(MechanicalWork)
    private readonly mechanicalRepo: Repository<MechanicalWork>,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async create(createMechanicalDto: CreateMechanicalDto): Promise<MechanicalWork> {
    const mechanical = this.mechanicalRepo.create(createMechanicalDto);
    const savedMechanical = await this.mechanicalRepo.save(mechanical);
    await this.redisCacheService.deleteByPattern('mechanical:*');
    return savedMechanical;
  }

  async findAll(query: MechanicalQueryDto): Promise<any> {
    const { page = 1, limit = 10, isExport = false, mechanical_works } = query;
    return this.redisCacheService.getOrSet(
      `mechanical:list:${mechanical_works ?? 'all'}:${isExport}:${page}:${limit}`,
      async () => {
        const where: any = {};
        if (mechanical_works) {
          where.mechanical_works = mechanical_works;
        }

        const findOptions: any = {
          where,
          order: { createdTime: 'DESC' },
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }

        const [mechanicalWorks, total] = await this.mechanicalRepo.findAndCount(findOptions);
        
        if (total === 0) {
          return { message: 'No Mechanical Works Found', data: [], total: 0 };
        }

        return {
          data: mechanicalWorks,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }

  async findOne(id: number): Promise<MechanicalWork | null> {
    return this.redisCacheService.getOrSet(
      `mechanical:detail:${id}`,
      async () => {
        return await this.mechanicalRepo.findOne({
          where: { id },
        });
      },
      1000 * 60 * 10,
    );
  }

  async update(id: number, updateMechanicalDto: UpdateMechanicalDto): Promise<MechanicalWork | null> {
    await this.mechanicalRepo.update(id, updateMechanicalDto);
    await this.redisCacheService.deleteByPattern('mechanical:*');
    return await this.findOne(id);
  }

  async remove(id: number): Promise<MechanicalWork | null> {
    const mechanical = await this.findOne(id);
    if (mechanical) {
      await this.mechanicalRepo.delete(id);
      await this.redisCacheService.deleteByPattern('mechanical:*');
    }
    return mechanical;
  }
}
