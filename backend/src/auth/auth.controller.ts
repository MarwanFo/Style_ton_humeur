import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

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
    if (user.twoFactorEnabled) {
      return {
        isTwoFactorRequired: true,
        userId: user.id,
      };
    }
    return this.authService.login(user);
  }

  @Post('2fa/login-verify')
  @HttpCode(HttpStatus.OK)
  async loginVerify(@Body() body: { userId: number; code: string }) {
    const isValid = await this.authService.verifyTwoFactorCode(body.userId, body.code);
    if (!isValid) {
      throw new UnauthorizedException('Code de validation 2FA incorrect');
    }
    return this.authService.loginWithUserId(body.userId);
  }

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generate2fa(@Request() req) {
    return this.authService.generateTwoFactorSecret(req.user.userId, req.user.email);
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async turnOn2fa(@Request() req, @Body() body: { code: string }) {
    const success = await this.authService.enableTwoFactor(req.user.userId, body.code);
    if (!success) {
      throw new UnauthorizedException('Code de validation 2FA incorrect');
    }
    return { success: true };
  }

  @Post('2fa/turn-off')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async turnOff2fa(@Request() req, @Body() body: { code: string }) {
    const success = await this.authService.disableTwoFactor(req.user.userId, body.code);
    if (!success) {
      throw new UnauthorizedException('Code de validation 2FA incorrect');
    }
    return { success: true };
  }
}
