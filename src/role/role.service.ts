import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto, CreateRoleByCountDto, UpdateRoleDto } from './dtos/role.dto';
import { RedisCacheService } from 'src/redis/redid-cache.service';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepo.create(createRoleDto);
    const created = await this.roleRepo.save(role);
    if (created) {
      await this.redisCacheService.deleteByPattern('roles:*');
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Role Created',
        data: created,
      };
    }
    return {
      statusCode: HttpStatus.EXPECTATION_FAILED,
      message: 'Role Not Created',
    };
  }

  async createByCount(createRoleByCountDto: CreateRoleByCountDto) {
    const { roleName, count } = createRoleByCountDto;
    const rolesToInsert = Array.from({ length: count }, () =>
      this.roleRepo.create({ roleName }),
    );
    const created = await this.roleRepo.save(rolesToInsert);
    if (created && created.length > 0) {
      await this.redisCacheService.deleteByPattern('roles:*');
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Roles Created',
        data: created,
      };
    }
    return {
      statusCode: HttpStatus.EXPECTATION_FAILED,
      message: 'Roles Not Created',
    };
  }

  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, isExport = false } = query;
    return this.redisCacheService.getOrSet(
      `roles:list:${isExport}:${page}:${limit}`,
      async () => {
        const findOptions: any = {};
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [roles, total] = await this.roleRepo.findAndCount(findOptions);
        if (total === 0) {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No Roles Found',
            data: [],
            total: 0,
          };
        }
        return {
          statusCode: HttpStatus.OK,
          message: 'Roles Found',
          data: roles,
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
      `roles:detail:${id}`,
      async () => {
        const role = await this.roleRepo.findOne({ where: { id } });
        if (!role) {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Role not found',
          };
        }
        return {
          statusCode: HttpStatus.OK,
          message: 'Role found',
          data: role,
        };
      },
      1000 * 60 * 10,
    );
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const result: any = await this.roleRepo.update(id, updateRoleDto);
    if (result.affected > 0) {
      await this.redisCacheService.deleteByPattern('roles:*');
      return {
        statusCode: HttpStatus.OK,
        message: 'Role Updated',
      };
    }
    return {
      statusCode: HttpStatus.EXPECTATION_FAILED,
      message: 'Role not updated',
    };
  }

  async remove(id: number) {
    const roleRes = await this.findOne(id);
    if (roleRes && roleRes.statusCode === HttpStatus.OK) {
      const result: any = await this.roleRepo.delete(id);
      if (result.affected > 0) {
        await this.redisCacheService.deleteByPattern('roles:*');
        return {
          statusCode: HttpStatus.OK,
          message: 'Role Deleted',
        };
      }
    }
    return {
      statusCode: HttpStatus.EXPECTATION_FAILED,
      message: 'Failed to delete role',
    };
  }
}
