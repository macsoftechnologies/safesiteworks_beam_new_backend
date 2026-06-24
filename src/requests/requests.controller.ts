import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';

import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dtos/create-request.dto';
import { UpdateRequestDto } from './dtos/update-request.dto';
import { SearchRequestDto } from './dtos/search-request.dto';
import { CreateByCountDto } from './dtos/create-by-count.dto';
import { generatePermitHtml } from './utils/permit-html-template';
import { generateLogsHtml } from './utils/logs-html-template';
import { buildPermitPdf, buildLogsPdf } from './utils/pdf-generator';

// Ensure directory exists
const uploadDir = './uploads/requests';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const requestMulterOptions = {
  storage: diskStorage({
    destination: uploadDir,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `rams_${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    // Allowed file types based on legacy mime mappings or file extension
    const mimeRegex = /\/(jpg|jpeg|png|gif|bmp|pdf|doc|docx|xls|xlsx|csv|mp4|webm|ogg|octet-stream|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.openxmlformats-officedocument.spreadsheetml.sheet|msword|vnd.ms-excel)$/i;
    const extRegex = /\.(jpg|jpeg|png|gif|bmp|pdf|doc|docx|xls|xlsx|csv|mp4|webm|ogg)$/i;

    const isMimeValid = file.mimetype && mimeRegex.test(file.mimetype);
    const isExtValid = file.originalname && extRegex.test(file.originalname);

    if (!isMimeValid && !isExtValid) {
      return callback(new Error('Unsupported or corrupt file type'), false);
    }
    callback(null, true);
  },
};

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) { }

  // 1. Create Request
  @Post()
  @UseInterceptors(FilesInterceptor('rams_file', 10, requestMulterOptions))
  async create(
    @Body() createDto: CreateRequestDto,
    @UploadedFiles() ramsFiles?: any[]
  ) {
    try {
      const result = await this.requestsService.create(createDto, ramsFiles);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Request creation failed',
      };
    }
  }

  // 2. Update Request
  @Put(':id')
  @UseInterceptors(FilesInterceptor('rams_file', 10, requestMulterOptions))
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRequestDto,
    @UploadedFiles() ramsFiles?: any[]
  ) {
    try {
      const result = await this.requestsService.update(Number(id), updateDto, ramsFiles);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Request update failed',
      };
    }
  }

  // 3. Search Requests
  @Post('search')
  @HttpCode(HttpStatus.OK)
  async search(@Body() searchDto: SearchRequestDto) {
    try {
      const results = await this.requestsService.search(searchDto);
      return results;
    } catch (error) {
      return {
        status: false,
        message: 'Error searching requests',
        error: error.message,
      };
    }
  }

  // 4. Bulk Update Status
  @Put('status/change')
  async updateStatus(@Body() body: { id: string; Request_status?: string; status?: number; userId?: number }) {
    try {
      const result = await this.requestsService.updateStatus(body);
      return result;
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Status update failed',
      };
    }
  }

  // 5a. Create by count — copy a permit N times across consecutive days (createbycount.php)
  @Post('createbycount')
  @HttpCode(HttpStatus.OK)
  async createByCount(@Body() dto: CreateByCountDto) {
    try {
      return await this.requestsService.createByCount(dto);
    } catch (error) {
      const status = typeof error.getStatus === 'function' ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      return {
        status,
        message: error.message || 'Create by count failed',
      };
    }
  }

  // 5. Soft delete single request (delete.php)
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    try {
      return await this.requestsService.softDelete(Number(id));
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 6. Bulk soft delete requests (multipledelete.php)
  @Delete()
  async softDeleteMultiple(@Body('ids') ids: number[]) {
    try {
      return await this.requestsService.softDeleteMultiple(ids);
    } catch (error) {
      return { status: false, message: error.message };
    }
  }

  // 7. Selected delete status update (deleteSelected.php)
  @Post('deleteSelected')
  async deleteSelected(@Body() body: { id: string; Request_status: string }) {
    try {
      return await this.requestsService.deleteSelected(body.id, body.Request_status);
    } catch (error) {
      return { status: 202, message: error.message };
    }
  }

  // 8. Delete RAMS file attachment (ramsfiledelete.php)
  @Delete('files/:fileId')
  async softDeleteRamsFile(@Param('fileId') fileId: string) {
    try {
      return await this.requestsService.softDeleteRamsFile(Number(fileId));
    } catch (error) {
      return { message: error.message };
    }
  }

  // Get RAMS file attachment (for download/view)
  @Get('files/:fileId')
  async getRamsFile(@Param('fileId') fileId: string, @Res() res: any) {
    try {
      const file = await this.requestsService.getRamsFile(Number(fileId));
      if (!file || !file.ramsFile) {
        return res.status(HttpStatus.NOT_FOUND).send('File not found');
      }
      const absolutePath = join(process.cwd(), file.ramsFile);
      if (!fs.existsSync(absolutePath)) {
        return res.status(HttpStatus.NOT_FOUND).send('File not found on disk');
      }
      res.sendFile(absolutePath);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  // 9. Add Notes (addnote.php)
  @Post('notes')
  async addNotes(@Body() body: { request_id: string; permit_no: string; user_id?: number; username?: string; note?: string; createdTime?: string }) {
    try {
      return await this.requestsService.addNotes(body);
    } catch (error) {
      return { status: 400, message: error.message };
    }
  }

  // 10. Fetch user logs (readLogs.php)
  @Get('logs/user/:userId')
  async readLogs(@Param('userId') userId: string) {
    try {
      return await this.requestsService.readLogs(Number(userId));
    } catch (error) {
      return { message: error.message };
    }
  }

  // 10b. Fetch permit logs (log.php) - path param style
  @Get('logs/permit/:permitNo')
  async getPermitLogs(@Param('permitNo') permitNo: string) {
    if (!permitNo || permitNo.trim() === '') {
      return { status: HttpStatus.BAD_REQUEST, message: 'Missing or empty permitNo' };
    }
    try {
      return await this.requestsService.getPermitLogs(permitNo);
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }

  // 10c. Fetch permit logs (log.php) - query param style
  @Get('logs')
  async getPermitLogsQuery(@Query('permit_no') permitNo: string) {
    if (!permitNo || permitNo.trim() === '') {
      return { status: HttpStatus.BAD_REQUEST, message: 'Missing or empty permit_no' };
    }
    try {
      return await this.requestsService.getPermitLogs(permitNo);
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }

  // 11. Create complete log (log.php)
  @Post('logs/complete')
  async createCompleteLog(@Body() body: { id: number; PermitNo: string; status: string; module: string }) {
    try {
      return await this.requestsService.createCompleteLog(body);
    } catch (error) {
      return { status: 200, message: error.message };
    }
  }


  // 14. Trigger cron expiration task (cron.php)
  @Post('cron/trigger')
  async triggerCron() {
    try {
      return await this.requestsService.triggerCron();
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  // 15. Fetch requests counts (readCounts.php)
  @Get('counts')
  async readCounts() {
    try {
      return await this.requestsService.readCounts();
    } catch (error) {
      return { message: error.message };
    }
  }

  // 16. Fetch request status count (readRequestCount.php)
  @Post('counts/status')
  async readRequestCount(@Body('Request_status') status: string) {
    try {
      return await this.requestsService.readRequestCount(status);
    } catch (error) {
      return { message: error.message };
    }
  }

  // 17. Fetch plans list with nested notes (planslist.php)
  @Post('plans')
  async plansList(@Body() searchDto: SearchRequestDto) {
    try {
      const result = await this.requestsService.search(searchDto);
      return [result[0], result[1]];
    } catch (error) {
      return { message: error.message };
    }
  }

  // 18. Fetch Graph counts per day (readGraph.php)
  @Post('analytics/graph')
  async readGraph(@Body() body: { WeekFirstday: string; WeekLastday: string }) {
    try {
      return await this.requestsService.readGraph(body.WeekFirstday, body.WeekLastday);
    } catch (error) {
      return { message: error.message };
    }
  }

  // 19. Fetch Graph summary (readGraphCounts.php)
  @Get('analytics/graph/counts')
  async readGraphCounts() {
    try {
      return await this.requestsService.readGraphCounts();
    } catch (error) {
      return { message: error.message };
    }
  }

  // --- NEWLY ADDED VIEW AND DOWNLOAD ROUTE ENDPOINTS ---

  @Get('permit-design/:permitNo')
  async servePermitHtml(@Param('permitNo') permitNo: string, @Res() res: any) {
    try {
      const data = await this.requestsService.getRequestDetailsByPermitNo(permitNo);
      if (!data) {
        return res.status(HttpStatus.NOT_FOUND).send('Permit not found');
      }
      const html = generatePermitHtml(data);
      res.type('html').send(html);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  @Get('permit-design/:permitNo/pdf')
  async downloadPermitPdf(@Param('permitNo') permitNo: string, @Res() res: any) {
    try {
      const data = await this.requestsService.getRequestDetailsByPermitNo(permitNo);
      if (!data) {
        return res.status(HttpStatus.NOT_FOUND).send('Permit not found');
      }
      const pdfBuffer = await buildPermitPdf(data);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Permit_${permitNo}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  @Get('logs-design/:permitNo')
  async serveLogsHtml(@Param('permitNo') permitNo: string, @Res() res: any) {
    try {
      const details = await this.requestsService.getLogsDetailsByPermitNo(permitNo);
      if (!details) {
        return res.status(HttpStatus.NOT_FOUND).send('Permit not found');
      }
      const html = generateLogsHtml(details.permitNo, details.logs, details.images);
      res.type('html').send(html);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }

  @Get('logs-design/:permitNo/pdf')
  async downloadLogsPdf(@Param('permitNo') permitNo: string, @Res() res: any) {
    try {
      const details = await this.requestsService.getLogsDetailsByPermitNo(permitNo);
      if (!details) {
        return res.status(HttpStatus.NOT_FOUND).send('Permit not found');
      }
      const pdfBuffer = await buildLogsPdf(details.permitNo, details.logs);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Permit_Logs_${permitNo}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }
}
