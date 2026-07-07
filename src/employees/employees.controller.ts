import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateDepEmployeeDto, CreateEmpDto, CreateEmployeeDto, CreateSubEmployeeDto, CreateUserLogDto, DeleteEmployeeDto, EmpListByDeptDto, ReadUsernameDto, SearchEmployeeDto, UpdateDepEmployeeDto, UpdateEmpDto, UpdateEmployeeDto, UpdateSubEmployeeDto, SubContEmployeesQueryDto } from './dtos/employee.dto';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';

// ─── Reusable response schemas ────────────────────────────────────────────────

const StatusResponse = (message: string) => ({
  schema: {
    example: { status: 200, message },
  },
});

const ErrorResponse = (message: string) => ({
  schema: {
    example: { status: 500, message },
  },
});

@ApiTags('Employees')
@Controller('employee')
export class EmployeesController {
  constructor(private readonly employeeService: EmployeesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({
    status: 200,
    description: 'Returns the full list of employees.',
    schema: {
      example: {
        data: [
          {
            id: 1,
            roleId: 2,
            departId: 3,
            subContId: 1,
            badgeId: 'EMP-001',
            employeeName: 'John Doe',
            companyName: 'Acme Corp',
            designation: 'Engineer',
            phonenumber: '+919876543210',
            access: 'read-write',
            username: 'johndoe',
            userType: 'permanent',
            createdAt: '2025-05-01T10:00:00.000Z',
            updatedAt: '2025-05-10T12:00:00.000Z',
          },
        ],
      },
    },
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.employeeService.findAll(query);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get employees by sub-contractor ID' })
  @ApiResponse({
    status: 200,
    description: 'Employees under the given sub-contractor.',
    schema: { example: { data: [{ id: 5, employeeName: 'Bob Builder', subContId: 1 }] } },
  })
  findBySubCont(@Query() query: SubContEmployeesQueryDto) {
    return this.employeeService.findBySubCont(query);
  }

  @Get('analytics/counts')
  @ApiOperation({ summary: 'Get employee counts grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'Employee counts grouped by Departments, Contractors, Observers, and Total (excluding admins/superadmins).',
  })
  async getEmployeeCounts() {
    try {
      return await this.employeeService.getEmployeeCounts();
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving employee counts' };
    }
  }

  @Get('logs-reports')
  @ApiOperation({ summary: 'Get all user activity logs (latest first)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20, description: 'Items per page (default: 20)' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        statusCode: 200,
        data: [
          {
            id: 1,
            action: 'LOGIN',
            body: '{}',
            method: 'POST',
            url: '/auth/login',
            status: '200',
            user: 'john@example.com',
            timestamp: '2024-01-01T12:00:00.000Z',
          },
        ],
        total: 100,
        page: 1,
        limit: 20,
        totalPages: 5,
      },
    },
  })
  getUserLogs(@Query() query: PaginationQueryDto) {
    return this.employeeService.getUserLogs(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single employee by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The employee record.',
    schema: {
      example: {
        id: 1,
        roleId: 2,
        employeeName: 'John Doe',
        designation: 'Engineer',
        username: 'johndoe',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Post('list-by-dept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get employees by department ID' })
  @ApiBody({ type: EmpListByDeptDto })
  @ApiResponse({
    status: 200,
    description: 'Employees in the given department.',
    schema: {
      example: { data: [{ id: 4, employeeName: 'Jane Smith', departId: 3, designation: 'Manager' }] },
    },
  })
  findByDepartment(@Body() dto: EmpListByDeptDto) {
    return this.employeeService.findByDepartment(dto);
  }

  @Post('check-username')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if a username already exists' })
  @ApiBody({ type: ReadUsernameDto })
  @ApiResponse({
    status: 200,
    description: 'Username existence check result.',
    schema: {
      examples: {
        exists: { value: { status: 200, message: 'Username Exists' } },
        notExists: { value: { status: 200, message: 'Username not Exists' } },
      },
    },
  })
  checkUsername(@Body() dto: ReadUsernameDto) {
    return this.employeeService.checkUsername(dto.username);
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Paginated employee search' })
  @ApiBody({ type: SearchEmployeeDto })
  @ApiResponse({
    status: 200,
    description: 'Paginated results with total count.',
    schema: {
      example: [
        { data: [{ id: 1, employeeName: 'John Doe' }] },
        { count: 42 },
      ],
    },
  })
  search(@Body() dto: SearchEmployeeDto) {
    return this.employeeService.search(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new employee (main)' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({ status: 200, ...StatusResponse('Employee Created') })
  @ApiResponse({ status: 204, ...StatusResponse('Empty Employee') })
  @ApiResponse({ status: 500, ...ErrorResponse('Employee Not Created') })
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Post('dep')
  @ApiOperation({ summary: 'Create a department employee' })
  @ApiBody({ type: CreateDepEmployeeDto })
  @ApiResponse({ status: 200, ...StatusResponse('Employee Created') })
  @ApiResponse({ status: 204, ...StatusResponse('Empty Employee') })
  @ApiResponse({ status: 500, ...ErrorResponse('Employee Not Created') })
  createDepEmployee(@Body() dto: CreateDepEmployeeDto) {
    return this.employeeService.createDepEmployee(dto);
  }

  @Post('sub')
  @ApiOperation({ summary: 'Create a sub-contractor employee' })
  @ApiBody({ type: CreateSubEmployeeDto })
  @ApiResponse({ status: 200, ...StatusResponse('Employee Created') })
  @ApiResponse({ status: 204, ...StatusResponse('Empty Employee') })
  @ApiResponse({ status: 500, ...ErrorResponse('Employee Not Created') })
  createSubEmployee(@Body() dto: CreateSubEmployeeDto) {
    return this.employeeService.createSubEmployee(dto);
  }

  @Post('emp')
  @ApiOperation({ summary: 'Create a type-aware employee' })
  @ApiBody({ type: CreateEmpDto })
  @ApiResponse({ status: 200, ...StatusResponse('Employee Created') })
  @ApiResponse({ status: 204, ...StatusResponse('Empty Employee') })
  @ApiResponse({ status: 500, ...ErrorResponse('Employee Not Created') })
  createEmp(@Body() dto: CreateEmpDto) {
    return this.employeeService.createEmp(dto);
  }

  @Put()
  @ApiOperation({ summary: 'Update an employee (main)' })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiResponse({ status: 200, ...StatusResponse('Employee Updated') })
  @ApiResponse({ status: 500, ...ErrorResponse('Employee not updated') })
  update(@Body() dto: UpdateEmployeeDto) {
    return this.employeeService.update(dto);
  }

  @Put('dep')
  @ApiOperation({ summary: 'Update a department employee' })
  @ApiBody({ type: UpdateDepEmployeeDto })
  @ApiResponse({ status: 200, ...StatusResponse('Employee Updated') })
  @ApiResponse({ status: 500, ...ErrorResponse('Employee not updated') })
  updateDepEmployee(@Body() dto: UpdateDepEmployeeDto) {
    return this.employeeService.updateDepEmployee(dto);
  }

  @Put('sub')
  @ApiOperation({ summary: 'Update a sub-contractor employee' })
  @ApiBody({ type: UpdateSubEmployeeDto })
  @ApiResponse({ status: 200, ...StatusResponse('Employee Updated') })
  @ApiResponse({ status: 500, ...ErrorResponse('Employee not updated') })
  updateSubEmployee(@Body() dto: UpdateSubEmployeeDto) {
    return this.employeeService.updateSubEmployee(dto);
  }

  @Put('emp')
  @ApiOperation({ summary: 'Update a type-aware employee' })
  @ApiBody({ type: UpdateEmpDto })
  @ApiResponse({ status: 200, ...StatusResponse('Employee Updated') })
  @ApiResponse({ status: 500, ...ErrorResponse('Employee not updated') })
  updateEmp(@Body() dto: UpdateEmpDto) {
    return this.employeeService.updateEmp(dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiBody({ type: DeleteEmployeeDto })
  @ApiResponse({ status: 200, schema: { example: { message: 'Employee deleted' } } })
  @ApiResponse({ status: 200, schema: { example: { message: 'Employee not deleted' } } })
  delete(@Body() dto: DeleteEmployeeDto) {
    return this.employeeService.delete(dto.id);
  }

  @Delete('user')
  @ApiOperation({ summary: 'Delete a user-type employee' })
  @ApiBody({ type: DeleteEmployeeDto })
  @ApiResponse({ status: 200, schema: { example: { message: 'Employee deleted' } } })
  userDelete(@Body() dto: DeleteEmployeeDto) {
    return this.employeeService.delete(dto.id);
  }

  @Post('log')
  @ApiOperation({ summary: 'Create a user activity log entry' })
  @ApiBody({ type: CreateUserLogDto })
  @ApiResponse({ status: 200, ...StatusResponse('User Log Created') })
  @ApiResponse({ status: 500, ...ErrorResponse('User Log Not Created') })
  createUserLog(@Body() dto: CreateUserLogDto) {
    return this.employeeService.createUserLog(dto);
  }
}