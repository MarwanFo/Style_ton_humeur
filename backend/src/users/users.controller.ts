import { Controller, Get, UseGuards, Request, NotFoundException, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req) {
    const userId = req.user.userId;
    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      gender: user.gender,
      age: user.age,
      twoFactorEnabled: (user as any).twoFactorEnabled,
      plan: user.plan,
      tier: user.tier,
      createdAt: user.createdAt,
    };
  }

  @Post('upgrade')
  async upgrade(@Request() req) {
    const userId = req.user.userId;
    const upgradedUser = await this.usersService.upgradeToPremium(userId);
    return {
      success: true,
      message: 'Compte mis à niveau vers PREMIUM avec succès !',
      user: {
        id: upgradedUser.id,
        email: upgradedUser.email,
        displayName: upgradedUser.displayName,
        gender: upgradedUser.gender,
        age: upgradedUser.age,
        plan: upgradedUser.plan,
        tier: upgradedUser.tier,
      }
    };
  }
}

