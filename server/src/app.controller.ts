import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return {
      message: 'Welcome to TouristMenuQR API',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/health')
  getHealth(): object {
    return {
      status: 'healthy',
      service: 'tourist-menu-qr-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
