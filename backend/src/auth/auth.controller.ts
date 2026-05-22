import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      pass: string;
      displayName: string;
      gender: string;
      age: number;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; pass: string }) {
    const user = await this.authService.validateUser(body.email, body.pass);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }
}
