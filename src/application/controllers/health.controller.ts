import { Controller, Get, UseInterceptors } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

@Controller('health')
@ApiTags('health')
@UseInterceptors(LoggingInterceptor)
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
}
