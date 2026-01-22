import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ChangePasswordDto } from '../dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    await this.authService.changePassword(
      req.user._id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }
}