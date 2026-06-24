import {
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateDepEmployeeDto, CreateEmpDto, CreateEmployeeDto, CreateSubEmployeeDto, CreateUserLogDto, SearchEmployeeDto, UpdateDepEmployeeDto, UpdateEmpDto, UpdateEmployeeDto, UpdateSubEmployeeDto, SubContEmployeesQueryDto, EmpListByDeptDto } from './dtos/employee.dto';
import { UserLog } from './entities/userlog.entity';
import { User } from '../users/entities/user.entity';
import { Subcontractor } from '../subcontractor/entities/subcontractor.entity';
import { RedisCacheService } from 'src/redis/redid-cache.service';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

const encodePassword = (plain: string): string =>
  plain ? Buffer.from(plain).toString('base64') : '';

const decodePassword = (encoded: string): string =>
  encoded ? Buffer.from(encoded, 'base64').toString('utf8') : '';

const TTL = {
  ALL: 1000 * 60 * 5,
  SINGLE: 1000 * 60 * 10,
  BY_DEPT: 1000 * 60 * 5,
  BY_SUBCONT: 1000 * 60 * 5,
  SEARCH: 1000 * 60 * 2,
  USERNAME: 1000 * 60 * 10,
} as const;

const CACHE_KEYS = {
  all: () => 'employees:all',
  single: (id: number) => `employees:id:${id}`,
  byDept: (id: number) => `employees:dept:${id}`,
  bySubCont: (id: number) => `employees:subcont:${id}`,
  search: (dto: SearchEmployeeDto) =>
    `employees:search:${dto.search ?? ''}:${dto.isExport ?? false}:${dto.page ?? 1}:${dto.limit ?? 10}`,
  username: (u: string) => `employees:username:${u}`,
};

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,

    @InjectRepository(UserLog)
    private readonly userLogRepo: Repository<UserLog>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Subcontractor)
    private readonly subContRepo: Repository<Subcontractor>,

    private readonly cache: RedisCacheService,
  ) { }

  private async invalidateAfterWrite(opts: {
    employeeId?: number;
    departId?: number;
    subContId?: number;
    username?: string;
  } = {}): Promise<void> {
    await this.cache.deleteByPattern('employees:*');
  }

  private async mapSubContractorAndUserType(employees: Employee[]): Promise<any[]> {
    const subContractors = await this.subContRepo.find();
    const subContMap = new Map(subContractors.map(sc => [sc.id, sc.subContractorName]));

    const users = await this.userRepo.find();
    const userMap = new Map(users.map(u => [u.empId, u.userType]));

    return employees.map(emp => ({
      ...emp,
      subContractorName: emp.subContId ? (subContMap.get(emp.subContId) ?? null) : null,
      userType: userMap.get(emp.id) ?? null,
      password: decodePassword(emp.password),
    }));
  }

  private async syncUserForEmployee(employee: Employee, dto: any, userType?: string) {
    if (dto.username || dto.password || userType || dto.departId || dto.subContId || dto.obserId) {
      let user = await this.userRepo.findOne({ where: { empId: employee.id } });
      if (!user) {
        user = this.userRepo.create({
          empId: employee.id,
          created: new Date(),
          otp: dto.otp ?? '',
        });
      }
      if (dto.username) user.username = dto.username;
      if (dto.password) user.password = encodePassword(dto.password);
      if (userType) user.userType = userType;
      if (dto.departId) user.typeId = dto.departId;
      else if (dto.subContId) user.typeId = dto.subContId;
      else if (dto.obserId) user.typeId = dto.obserId;
      if (dto.otp) user.otp = dto.otp;
      await this.userRepo.save(user);
    }
  }

  async findAll(query: PaginationQueryDto): Promise<any> {
    const { page = 1, limit = 10, isExport = false } = query;
    return this.cache.getOrSet(
      `employees:list:all:${isExport}:${page}:${limit}`,
      async () => {
        const findOptions: any = {};
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [employees, total] = await this.employeeRepo.findAndCount(findOptions);
        const mappedData = await this.mapSubContractorAndUserType(employees);
        if (mappedData.length > 0) {
          return {
            statusCode: HttpStatus.OK,
            message: "Employees fetched successfully",
            data: mappedData,
            total,
            page: isExport ? 1 : page,
            limit: isExport ? total : limit,
            totalPages: isExport ? 1 : Math.ceil(total / limit),
          };
        }
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "Employees not found",
        };
      },
      TTL.ALL,
    );
  }

  async findOne(id: number): Promise<any> {
    return this.cache.getOrSet(
      `employees:detail:${id}`,
      async () => {
        const employee = await this.employeeRepo.findOne({ where: { id } });
        if (!employee) {
          throw new NotFoundException(`Employee with id ${id} not found`);
        }
        const mapped = await this.mapSubContractorAndUserType([employee]);
        if (mapped.length > 0) {
          return {
            statusCode: HttpStatus.OK,
            message: "Employee fetched successfully",
            data: mapped[0],
          };
        } else {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: "Employee not found",
          };
        }
      },
      TTL.SINGLE,
    );
  }

  async findBySubCont(query: SubContEmployeesQueryDto): Promise<any> {
    const { subcont: subContId, page = 1, limit = 10, isExport = false } = query;
    return this.cache.getOrSet(
      `employees:list:subcont:${subContId}:${isExport}:${page}:${limit}`,
      async () => {
        const findOptions: any = {
          where: { subContId },
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [employees, total] = await this.employeeRepo.findAndCount(findOptions);
        const mappedData = await this.mapSubContractorAndUserType(employees);
        if (mappedData.length > 0) {
          return {
            statusCode: HttpStatus.OK,
            message: "Employees fetched by company successfully",
            data: mappedData,
            total,
            page: isExport ? 1 : page,
            limit: isExport ? total : limit,
            totalPages: isExport ? 1 : Math.ceil(total / limit),
          };
        } else {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: "Employees not found",
          };
        }
      },
      TTL.BY_SUBCONT,
    );
  }

  async findByDepartment(dto: EmpListByDeptDto): Promise<any> {
    const { departId, page = 1, limit = 10, isExport = false } = dto;
    return this.cache.getOrSet(
      `employees:list:dept:${departId}:${isExport}:${page}:${limit}`,
      async () => {
        const findOptions: any = {
          where: { departId },
        };
        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = (page - 1) * limit;
        }
        const [employees, total] = await this.employeeRepo.findAndCount(findOptions);
        const mappedData = await this.mapSubContractorAndUserType(employees);
        if (mappedData.length > 0) {
          return {
            statusCode: HttpStatus.OK,
            message: "Employees fetched by department successfully",
            data: mappedData,
            total,
            page: isExport ? 1 : page,
            limit: isExport ? total : limit,
            totalPages: isExport ? 1 : Math.ceil(total / limit),
          };
        } else {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: "Employees not found",
          };
        }
      },
      TTL.BY_DEPT,
    );
  }

  async checkUsername(
    username: string,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    return this.cache.getOrSet(
      CACHE_KEYS.username(username),
      async () => {
        const count = await this.employeeRepo.count({ where: { username } });
        return count > 0
          ? { statusCode: HttpStatus.CONFLICT, message: 'Username Exists' }
          : { statusCode: HttpStatus.OK, message: 'Username not Exists' };
      },
      TTL.USERNAME,
    );
  }

  async search(
    dto: SearchEmployeeDto,
  ): Promise<any> {
    return this.cache.getOrSet(
      CACHE_KEYS.search(dto),
      async () => {
        const { page = 1, limit = 10, isExport = false } = dto;
        const skip = (page - 1) * limit;

        let where: FindOptionsWhere<Employee> | FindOptionsWhere<Employee>[] = {};

        if (dto.search) {
          const searchPattern = Like(`%${dto.search}%`);
          where = [
            { employeeName: searchPattern },
            { email: searchPattern },
            { badgeId: searchPattern },
            { username: searchPattern },
            { companyName: searchPattern },
            { designation: searchPattern },
          ];
        }

        const findOptions: any = {
          where,
        };

        if (!isExport) {
          findOptions.take = limit;
          findOptions.skip = skip;
        }

        const [data, total] = await this.employeeRepo.findAndCount(findOptions);

        const mappedData = await this.mapSubContractorAndUserType(data);
        if (mappedData.length > 0) {
          return {
            statusCode: HttpStatus.OK,
            message: "Employees fetched successfully",
            data: mappedData,
            total,
            page: isExport ? 1 : page,
            limit: isExport ? total : limit,
            totalPages: isExport ? 1 : Math.ceil(total / limit),
          };
        } else {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: "Employees not found",
          };
        }
      },
      TTL.SEARCH,
    );
  }

  async create(dto: CreateEmployeeDto): Promise<{ statusCode: HttpStatus; message: string }> {
    if (!dto.employeeName) {
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Empty Employee' };
    }

    const employee = this.employeeRepo.create({
      ...dto,
      phonenumber: dto.phonenumber ? `+${dto.phonenumber}` : undefined,
      password: dto.password ? encodePassword(dto.password) : undefined,
    } as any) as any as Employee;

    await this.employeeRepo.save(employee);

    // Sync with User table
    let userType = dto.userType;
    if (!userType) {
      if (dto.subContId) userType = 'Subcontractor';
      else if (dto.departId) userType = 'Department';
      else if (dto.obserId) userType = 'Observer';
      else userType = 'Admin';
    }

    await this.syncUserForEmployee(employee, dto, userType);

    await this.invalidateAfterWrite({
      departId: dto.departId,
      subContId: dto.subContId,
      username: dto.username,
    });

    return { statusCode: HttpStatus.OK, message: 'Employee Created' };
  }

  async createDepEmployee(
    dto: CreateDepEmployeeDto,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    if (!dto.employeeName) {
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Empty Employee' };
    }

    const otp = dto.otp ?? String(Math.floor(100000 + Math.random() * 900000));

    const employee = this.employeeRepo.create({
      ...dto,
      password: dto.password ? encodePassword(dto.password) : undefined,
    } as any) as any as Employee;

    await this.employeeRepo.save(employee);

    // Sync with User table as Department user
    await this.syncUserForEmployee(employee, { ...dto, otp }, 'Department');

    await this.invalidateAfterWrite({
      departId: dto.departId,
      username: dto.username,
    });

    return { statusCode: HttpStatus.OK, message: 'Employee Created' };
  }

  async createSubEmployee(
    dto: CreateSubEmployeeDto,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    if (!dto.employeeName) {
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Empty Employee' };
    }

    const employee = this.employeeRepo.create({
      ...dto,
      password: dto.password ? encodePassword(dto.password) : undefined,
    } as any) as any as Employee;

    await this.employeeRepo.save(employee);

    // Sync with User table as Subcontractor user
    await this.syncUserForEmployee(employee, dto, 'Subcontractor');

    await this.invalidateAfterWrite({
      subContId: dto.subContId,
      username: dto.username,
    });

    return { statusCode: HttpStatus.OK, message: 'Employee Created' };
  }

  async createEmp(dto: CreateEmpDto): Promise<{ statusCode: HttpStatus; message: string }> {
    if (!dto.employeeName) {
      return { statusCode: HttpStatus.NO_CONTENT, message: 'Empty Employee' };
    }

    const employee = this.employeeRepo.create({
      ...dto,
      password: dto.password ? encodePassword(dto.password) : undefined,
    } as any) as any as Employee;

    await this.employeeRepo.save(employee);

    // Sync with User table
    await this.syncUserForEmployee(employee, dto, dto.type ?? 'Admin');

    await this.invalidateAfterWrite({ username: dto.username });

    return { statusCode: HttpStatus.OK, message: 'Employee Created' };
  }

  async update(dto: UpdateEmployeeDto): Promise<{ statusCode: HttpStatus; message: string }> {
    const existing = await this.employeeRepo.findOne({ where: { id: dto.id } });
    if (!existing) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Employee not updated' };
    }

    Object.assign(existing, dto);
    await this.employeeRepo.save(existing);

    // Sync with User table
    let userType = dto.userType;
    if (!userType) {
      if (dto.subContId) userType = 'Subcontractor';
      else if (dto.departId) userType = 'Department';
      else if (dto.obserId) userType = 'Observer';
      else userType = 'Admin';
    }

    await this.syncUserForEmployee(existing, dto, userType);

    await this.invalidateAfterWrite({
      employeeId: dto.id,
      departId: dto.departId,
      subContId: dto.subContId,
      username: dto.username,
    });

    return { statusCode: HttpStatus.OK, message: 'Employee Updated' };
  }

  async updateDepEmployee(
    dto: UpdateDepEmployeeDto,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    const existing = await this.employeeRepo.findOne({ where: { id: dto.id } });
    if (!existing) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Employee not updated' };
    }

    const { id, ...fields } = dto;
    Object.assign(existing, fields);
    await this.employeeRepo.save(existing);

    // Sync with User table
    await this.syncUserForEmployee(existing, dto, 'Department');

    await this.invalidateAfterWrite({
      employeeId: id,
      departId: dto.departId,
      username: dto.username,
    });

    return { statusCode: HttpStatus.OK, message: 'Employee Updated' };
  }

  async updateSubEmployee(
    dto: UpdateSubEmployeeDto,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    const existing = await this.employeeRepo.findOne({ where: { id: dto.id } });
    if (!existing) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Employee not updated' };
    }

    const { id, ...fields } = dto;
    Object.assign(existing, fields);
    await this.employeeRepo.save(existing);

    // Sync with User table
    await this.syncUserForEmployee(existing, dto, 'Subcontractor');

    await this.invalidateAfterWrite({
      employeeId: id,
      subContId: dto.subContId,
      username: dto.username,
    });

    return { statusCode: HttpStatus.OK, message: 'Employee Updated' };
  }

  async updateEmp(dto: UpdateEmpDto): Promise<{ statusCode: HttpStatus; message: string }> {
    const existing = await this.employeeRepo.findOne({ where: { id: dto.id } });
    if (!existing) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Employee not updated' };
    }

    const { id, ...fields } = dto;
    Object.assign(existing, fields);
    await this.employeeRepo.save(existing);

    // Sync with User table
    await this.syncUserForEmployee(existing, dto, dto.type);

    await this.invalidateAfterWrite({
      employeeId: id,
      username: dto.username,
    });

    return { statusCode: HttpStatus.OK, message: 'Employee Updated' };
  }

  async delete(id: number): Promise<{ statusCode: HttpStatus; message: string }> {
    const existing = await this.employeeRepo.findOne({ where: { id } });

    const result = await this.employeeRepo.delete(id);
    if (!result.affected) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Employee not deleted' };
    }

    // Also delete user record
    await this.userRepo.delete({ empId: id });

    await this.invalidateAfterWrite({
      employeeId: id,
      departId: existing?.departId,
      subContId: existing?.subContId,
      username: existing?.username,
    });

    return { statusCode: HttpStatus.OK, message: 'Employee deleted' };
  }

  async createUserLog(
    dto: CreateUserLogDto,
  ): Promise<{ statusCode: HttpStatus; message: string }> {
    const log = this.userLogRepo.create(dto);
    await this.userLogRepo.save(log);
    return { statusCode: HttpStatus.OK, message: 'User Log Created' };
  }
}