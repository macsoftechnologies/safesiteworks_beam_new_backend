import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, Query, UseInterceptors, UploadedFile, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { SubcontractorService } from './subcontractor.service';
import { CreateSubcontractorDto, UpdateSubcontractorDto } from './dtos/subcontractor.dto';
import { PaginationQueryDto } from 'src/redis/dtos/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads/subcontractors',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|pdf|doc|png|gif|bmp|webp)$/)) {
      return callback(new Error('Unsupported or corrupt image file'), false);
    }
    callback(null, true);
  },
};

@Controller('subcontractors')
export class SubcontractorController {
  constructor(private readonly subcontractorService: SubcontractorService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: PaginationQueryDto, @Request() req: any) {
    try {
      const subcontractors = await this.subcontractorService.findAll(query, req.user?.userId);
      return subcontractors;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const subcontractor = await this.subcontractorService.findOne(Number(id));
      return subcontractor;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  async create(
    @Body() createSubcontractorDto: CreateSubcontractorDto,
    @UploadedFile() logo?: any,
  ) {
    try {
      const subcontractor = await this.subcontractorService.create(createSubcontractorDto, logo?.filename);
      return subcontractor
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo', multerOptions))
  async update(
    @Param('id') id: string,
    @Body() updateSubcontractorDto: UpdateSubcontractorDto,
    @UploadedFile() logo?: any,
  ) {
    try {
      const subcontractor = await this.subcontractorService.update(Number(id), updateSubcontractorDto, logo?.filename);
      return subcontractor
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const subcontractor = await this.subcontractorService.remove(Number(id));
      return subcontractor
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }
}
