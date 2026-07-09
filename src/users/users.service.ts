import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RedisCacheService } from 'src/redis/redid-cache.service';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private redisCacheService: RedisCacheService,
  ) {}

  async getUsers() {
    return this.getAllUsers({ page: 1, limit: 100 });
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }

  /**
   * Find user by ID
   */
  async findById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  /**
   * Create a new user
   */
  async create(userData: Partial<User>) {
    const user = this.userRepo.create(userData);
    const result = await this.userRepo.save(user);
    await this.redisCacheService.deleteByPattern('users:*');
    return result;
  }

  /**
   * Update user password
   */
  async updatePassword(id: number, password: string): Promise<boolean> {
    const result = await this.userRepo.update(id, { password });
    await this.redisCacheService.deleteByPattern('users:*');
    return (result.affected ?? 0) > 0;
  }

  /**
   * Update user OTP
   */
  async updateOtp(id: number, otp: string) {
    const result = await this.userRepo.update(id, {
      otp,
    });
    await this.redisCacheService.deleteByPattern('users:*');
    return result;
  }

  /**
   * Clear user OTP
   */
  async clearOtp(id: number) {
    const result = await this.userRepo.update(id, {
      otp: '',
    });
    await this.redisCacheService.deleteByPattern('users:*');
    return result;
  }

  /**
   * Update auth token
   */
  async updateAuthToken(id: number, auth_token: string) {
    const result = await this.userRepo.update(id, { auth_token });
    await this.redisCacheService.deleteByPattern('users:*');
    return result;
  }

  /**
   * Get all users
   */
  async getAllUsers(query: PaginationQueryDto, loggedInUserId?: number) {
    const { page = 1, limit = 10, isExport = false } = query;

    let subContId: number | null = null;
    if (loggedInUserId) {
      const loggedInUser = await this.userRepo.findOne({ where: { id: loggedInUserId } });
      if (loggedInUser && loggedInUser.userType === 'Subcontractor') {
        subContId = loggedInUser.typeId;
      }
    }

    const cacheKey = subContId
      ? `users:list:${isExport}:${page}:${limit}:subcon:${subContId}`
      : `users:list:${isExport}:${page}:${limit}`;

    return this.redisCacheService.getOrSet(
      cacheKey,
      async () => {
        const findOptions: any = {
          order: { created: 'DESC' },
        };
        if (subContId) {
          findOptions.where = {
            userType: 'Subcontractor',
            typeId: subContId,
          };
        }
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [users, total] = await this.userRepo.findAndCount(findOptions);
        return {
          data: users,
          total,
          page: isExport ? 1 : page,
          limit: isExport ? total : limit,
          totalPages: isExport ? 1 : Math.ceil(total / limit),
        };
      },
      1000 * 60 * 5,
    );
  }
}