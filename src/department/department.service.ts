import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dtos/department.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentRepo.create(createDepartmentDto);
    const create_depart = await this.departmentRepo.save(department);
    if (create_depart) {
      await this.redisCacheService.deleteByPattern('departments:*');
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Department Created',
        data: create_depart,
      };
    }
    return {
      statusCode: HttpStatus.EXPECTATION_FAILED,
      message: 'Failed to create department',
    };
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, isExport = false } = query;
    return this.redisCacheService.getOrSet(
      `departments:list:${isExport}:${page}:${limit}`,
      async () => {
        const findOptions: any = {
          order: { createdTime: 'DESC' },
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [departments, total] = await this.departmentRepo.findAndCount(findOptions);
        if (total === 0) {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No departments found',
            data: [],
            total: 0,
          };
        }
        return {
          statusCode: HttpStatus.OK,
          message: 'Departments found',
          data: departments,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }

  async findOne(id: number) {
    return this.redisCacheService.getOrSet(
      `departments:detail:${id}`,
      async () => {
        const department = await this.departmentRepo.findOne({ where: { id } });
        if (!department) {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Department not found',
          };
        }
        return {
          statusCode: HttpStatus.OK,
          message: 'Department found',
          data: department,
        };
      },
      1000 * 60 * 10,
    );
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const update_depart: any = await this.departmentRepo.update(id, updateDepartmentDto);
    if (update_depart.affected > 0) {
      await this.redisCacheService.deleteByPattern('departments:*');
      return {
        statusCode: HttpStatus.OK,
        message: 'Department Updated',
      };
    }
    return {
      statusCode: HttpStatus.EXPECTATION_FAILED,
      message: 'Failed to update department',
    };
  }

  async remove(id: number) {
    const departmentRes = await this.findOne(id);
    if (departmentRes && departmentRes.statusCode === HttpStatus.OK) {
      const delete_depart: any = await this.departmentRepo.delete(id);
      if (delete_depart.affected > 0) {
        await this.redisCacheService.deleteByPattern('departments:*');
        return {
          statusCode: HttpStatus.OK,
          message: 'Department Deleted',
        };
      }
    }
    return {
      statusCode: HttpStatus.EXPECTATION_FAILED,
      message: 'Failed to delete department',
    };
  }
}
