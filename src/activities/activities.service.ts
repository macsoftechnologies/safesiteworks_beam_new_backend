import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto, UpdateActivityDto, ActivitiesQueryDto } from './dtos/activity.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepo: Repository<Activity>,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = this.activitiesRepo.create(createActivityDto);
    const savedActivity = await this.activitiesRepo.save(activity);
    await this.redisCacheService.deleteByPattern('activities:*');
    return savedActivity;
  }

  async findAll(query: ActivitiesQueryDto): Promise<any> {
    const { page = 1, limit = 10, isExport = false, activityName } = query;
    return this.redisCacheService.getOrSet(
      `activities:list:${activityName ?? 'all'}:${isExport}:${page}:${limit}`,
      async () => {
        const where: any = {};
        if (activityName) {
          where.activityName = activityName;
        }

        const findOptions: any = {
          where,
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }

        const [activities, total] = await this.activitiesRepo.findAndCount(findOptions);
        
        if (total === 0) {
          return { message: 'No Activities Found', data: [], total: 0 };
        }

        return {
          data: activities,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }

  async findOne(id: number): Promise<Activity | null> {
    return this.redisCacheService.getOrSet(
      `activities:detail:${id}`,
      async () => {
        return await this.activitiesRepo.findOne({
          where: { id },
        });
      },
      1000 * 60 * 10,
    );
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity | null> {
    await this.activitiesRepo.update(id, updateActivityDto);
    await this.redisCacheService.deleteByPattern('activities:*');
    return await this.findOne(id);
  }

  async remove(id: number): Promise<Activity | null> {
    const activity = await this.findOne(id);
    if (activity) {
      await this.activitiesRepo.delete(id);
      await this.redisCacheService.deleteByPattern('activities:*');
    }
    return activity;
  }
}
