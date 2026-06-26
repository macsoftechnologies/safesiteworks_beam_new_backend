import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto, UpdateZoneDto, ZonesQueryDto } from './dtos/zone.dto';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) { }

  @Get()
  async findAll(@Query() query: ZonesQueryDto) {
    try {
      const zones = await this.zonesService.findAll(query);
      return zones;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving zones' };
    }
  }

  // Backwards compatibility for the legacy POST read_zones.php filter endpoint
  @Post('query')
  async queryZones(@Body() body: { level?: string; building_id?: any; zone?: string }) {
    try {
      const filters = {
        level: body.level,
        building_id: body.building_id ? Number(body.building_id) : undefined,
        zone: body.zone,
      };
      const zones = await this.zonesService.findAll(filters);
      if (!zones || zones.length === 0) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'No Zones Found' };
      }
      return zones;
    } catch (error) {
      return { statusCode: HttpStatus.NOT_FOUND, message: 'No Zones Found' };
    }
  }

  @Get('status/counts')
  async getStatusCounts() {
    try {
      return await this.zonesService.getStatusCounts();
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving zone status counts' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const zone = await this.zonesService.findOne(Number(id));
      if (!zone) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Zone not found' };
      }
      return zone;
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error retrieving zone' };
    }
  }

  @Post()
  async create(@Body() createZoneDto: CreateZoneDto) {
    try {
      const zone = await this.zonesService.create(createZoneDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Zone created successfully.',
        data: zone,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create zone.',
      };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateZoneDto: UpdateZoneDto,
  ) {
    try {
      const zone = await this.zonesService.update(Number(id), updateZoneDto);
      if (!zone) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Zone not found',
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Zone Updated',
        data: zone,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Zone not updated',
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const zone = await this.zonesService.remove(Number(id));
      if (!zone) {
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Zone not found' };
      }
      return { statusCode: HttpStatus.OK, message: 'Zone deleted' };
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Zone not deleted' };
    }
  }
}
