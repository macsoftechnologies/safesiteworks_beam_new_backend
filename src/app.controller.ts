import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller(':tenant') // ✅ add tenant here
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(@Req() req: any): string {
  //   console.log('Tenant:', req.tenant); // debug
  //   return this.appService.getHello();
  // }
}