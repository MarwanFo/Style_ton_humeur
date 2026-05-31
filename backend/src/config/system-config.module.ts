import { Module } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { SystemConfigController } from './system-config.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [SystemConfigController],
  providers: [SystemConfigService],
  exports: [SystemConfigService],
})
export class SystemConfigModule {}
