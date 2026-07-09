import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcontractor } from './entities/subcontractor.entity';
import { CreateSubcontractorDto, UpdateSubcontractorDto } from './dtos/subcontractor.dto';
import { FileUploadService } from './file-upload.service';
import { RedisCacheService } from 'src/redis/redid-cache.service';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SubcontractorService {
  constructor(
    @InjectRepository(Subcontractor)
    private subcontractorRepo: Repository<Subcontractor>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private fileUploadService: FileUploadService,
    private readonly redisCacheService: RedisCacheService,
  ) { }

  async create(createSubcontractorDto: CreateSubcontractorDto, logoFilename?: string) {
    try {
      const subcontractor = this.subcontractorRepo.create({
        ...createSubcontractorDto,
        logo: logoFilename,
      });

      const result = await this.subcontractorRepo.save(subcontractor);
      if (result) {
        await this.redisCacheService.deleteByPattern('subcontractors:*');
        return {
          statusCode: HttpStatus.CREATED,
          message: 'SubContractor Created',
          data: result,
        };
      }
      return {
        statusCode: HttpStatus.EXPECTATION_FAILED,
        message: 'Failed to create subcontractor',
      };
    }
    catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async findAll(query: PaginationQueryDto, loggedInUserId?: number) {
    try {
      const { page = 1, limit = 10, isExport = false } = query;

      let subContractorId: number | null = null;
      if (loggedInUserId) {
        const user = await this.userRepo.findOne({ where: { id: loggedInUserId } });
        if (user && user.userType === 'Subcontractor') {
          subContractorId = user.typeId;
        }
      }

      const cacheKey = subContractorId
        ? `subcontractors:list:${isExport}:${page}:${limit}:subcon:${subContractorId}`
        : `subcontractors:list:${isExport}:${page}:${limit}`;

      return this.redisCacheService.getOrSet(
        cacheKey,
        async () => {
          const findOptions: any = {
            order: { createdTime: 'DESC' },
          };
          if (subContractorId) {
            findOptions.where = { id: subContractorId };
          }
          if (!isExport) {
            findOptions.take = limit;
            findOptions.skip = (page - 1) * limit;
          }
          const [subcontractors, total] = await this.subcontractorRepo.findAndCount(findOptions);
          if (total === 0) {
            return { statusCode: HttpStatus.NOT_FOUND, message: 'No SubContractors Found', data: [], total: 0 };
          }
          return {
            statusCode: HttpStatus.OK,
            message: 'SubContractors Found',
            data: subcontractors,
            total,
            page: isExport ? 1 : page,
            limit: isExport ? total : limit,
            totalPages: isExport ? 1 : Math.ceil(total / limit),
          };
        },
        1000 * 60 * 5,
      );
    }
    catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async findOne(id: number) {
    try {
      return this.redisCacheService.getOrSet(
        `subcontractors:detail:${id}`,
        async () => {
          const subcontractor = await this.subcontractorRepo.findOne({ where: { id } });
          if (!subcontractor) {
            return { statusCode: HttpStatus.NOT_FOUND, message: 'SubContractor not found' };
          }
          return {
            statusCode: HttpStatus.OK,
            message: 'SubContractor found',
            data: subcontractor,
          }
        },
        1000 * 60 * 10,
      );
    }
    catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async update(id: number, updateSubcontractorDto: UpdateSubcontractorDto, logoFilename?: string) {
    try {
      const existing: any = await this.findOne(id);
      if (existing.statusCode !== HttpStatus.OK) {
        return existing;
      }
      const updateData: any = { ...updateSubcontractorDto };
      if (logoFilename !== undefined) {
        // If a new logo is uploaded, delete the old logo from disk
        if (existing.data?.logo) {
          this.fileUploadService.deleteFile(existing.data.logo);
        }
        updateData.logo = logoFilename;
      }

      await this.subcontractorRepo.update(id, updateData);
      await this.redisCacheService.deleteByPattern('subcontractors:*');
      return await this.findOne(id);
    }
    catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  async remove(id: number) {
    const subcontractor: any = await this.findOne(id);
    if (subcontractor.statusCode === HttpStatus.OK && subcontractor.data) {
      if (subcontractor.data.logo) {
        this.fileUploadService.deleteFile(subcontractor.data.logo);
      }
      await this.subcontractorRepo.delete(id);
      await this.redisCacheService.deleteByPattern('subcontractors:*');
    }
    return {
      statusCode: HttpStatus.OK,
      message: "Subcontractor deleted successfully",
      data: subcontractor.data
    };
  }
}
