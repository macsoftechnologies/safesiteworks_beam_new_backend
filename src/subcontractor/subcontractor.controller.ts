import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, Query, UseInterceptors, UploadedFile, HttpStatus, UseGuards, Request, Res } from '@nestjs/common';
import { SubcontractorService } from './subcontractor.service';
import { CreateSubcontractorDto, UpdateSubcontractorDto, SubcontractorPaginationQueryDto } from './dtos/subcontractor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

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
    const imageRegex = /\/(jpg|jpeg|png|gif|bmp|webp|svg\+xml|x-png)$/i;
    const extRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
    const isMimeValid = file.mimetype && imageRegex.test(file.mimetype);
    const isExtValid = file.originalname && extRegex.test(file.originalname);
    if (!isMimeValid && !isExtValid) {
      return callback(new Error('Only image files are allowed for contractor logo (jpg, jpeg, png, gif, bmp, webp, svg)'), false);
    }
    callback(null, true);
  },
};

function findFileOnDisk(filename: string): string | null {
  const cleanFilename = filename.split('/').pop()?.split('\\').pop() || filename;

  const possibleDirs = [
    join(process.cwd(), 'uploads', 'subcontractors'),
    join(process.cwd(), 'uploads'),
    join(__dirname, '..', '..', 'uploads', 'subcontractors'),
    join(__dirname, '..', '..', 'uploads'),
    '/www/wwwroot/api.beam.safesiteworks.com/beam_2.0_north_backend/uploads/subcontractors',
  ];

  for (const dir of possibleDirs) {
    if (!fs.existsSync(dir)) continue;

    // 1. Exact match
    const exactPath = join(dir, cleanFilename);
    if (fs.existsSync(exactPath)) {
      return exactPath;
    }

    // 2. Case-insensitive match for Linux OS
    try {
      const files = fs.readdirSync(dir);
      const matched = files.find(f => f.toLowerCase() === cleanFilename.toLowerCase());
      if (matched) {
        return join(dir, matched);
      }
    } catch {
      // ignore read errors
    }
  }

  return null;
}

@Controller('subcontractors')
export class SubcontractorController {
  constructor(private readonly subcontractorService: SubcontractorService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: SubcontractorPaginationQueryDto, @Request() req: any) {
    try {
      const subcontractors = await this.subcontractorService.findAll(query, req.user?.userId);
      return subcontractors;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }

  @Get('logo/:filename')
  async getLogo(@Param('filename') filename: string, @Res() res: any) {
    try {
      const filePath = findFileOnDisk(filename);
      if (filePath) {
        return res.sendFile(filePath);
      }
      return res.status(HttpStatus.NOT_FOUND).send('File not found on disk');
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: any) {
    try {
      // If the parameter is an image filename or non-numeric string, serve the file directly
      if (/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(id) || isNaN(Number(id))) {
        const filePath = findFileOnDisk(id);
        if (filePath) {
          return res.sendFile(filePath);
        }
        return res.status(HttpStatus.NOT_FOUND).send('File not found on disk');
      }

      const subcontractor = await this.subcontractorService.findOne(Number(id));
      return res.json(subcontractor);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message });
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
