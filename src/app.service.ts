import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

}