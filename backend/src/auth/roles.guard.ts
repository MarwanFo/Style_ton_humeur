import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by JwtAuthGuard

    if (!user || !user.userId) {
      throw new ForbiddenException('Authentification requise');
    }

    const dbUser = await this.usersService.findById(user.userId) as any;
    if (!dbUser || dbUser.role !== 'ADMIN') {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    return true;
  }
}
