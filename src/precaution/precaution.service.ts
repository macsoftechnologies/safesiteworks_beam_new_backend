import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Precaution } from './entities/precaution.entity';
import { CreatePrecautionDto, UpdatePrecautionDto, PrecautionQueryDto } from './dtos/precaution.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';

@Injectable()
export class PrecautionService {
  constructor(
    @InjectRepository(Precaution)
    private readonly precautionRepo: Repository<Precaution>,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async create(createPrecautionDto: CreatePrecautionDto): Promise<Precaution> {
    const precautionObj = this.precautionRepo.create(createPrecautionDto);
    const savedPrecaution = await this.precautionRepo.save(precautionObj);
    await this.redisCacheService.deleteByPattern('precaution:*');
    return savedPrecaution;
  }

  async findAll(query: PrecautionQueryDto): Promise<any> {
    const { page = 1, limit = 10, isExport = false, precaution } = query;
    return this.redisCacheService.getOrSet(
      `precaution:list:${precaution ?? 'all'}:${isExport}:${page}:${limit}`,
      async () => {
        const where: any = {};
        if (precaution) {
          where.precaution = precaution;
        }

        const findOptions: any = {
          where,
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }

        const [precautions, total] = await this.precautionRepo.findAndCount(findOptions);
        
        if (total === 0) {
          return { message: 'No Precaution Found', data: [], total: 0 };
        }

        return {
          data: precautions,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }

  async findOne(id: number): Promise<Precaution | null> {
    return this.redisCacheService.getOrSet(
      `precaution:detail:${id}`,
      async () => {
        return await this.precautionRepo.findOne({
          where: { id },
        });
      },
      1000 * 60 * 10,
    );
  }

  async update(id: number, updatePrecautionDto: UpdatePrecautionDto): Promise<Precaution | null> {
    await this.precautionRepo.update(id, updatePrecautionDto);
    await this.redisCacheService.deleteByPattern('precaution:*');
    return await this.findOne(id);
  }

  async remove(id: number): Promise<Precaution | null> {
    const precautionObj = await this.findOne(id);
    if (precautionObj) {
      await this.precautionRepo.delete(id);
      await this.redisCacheService.deleteByPattern('precaution:*');
    }
    return precautionObj;
  }
}
