import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body()
    body: {
      email: string;
      pass: string;
      displayName: string;
      gender: string;
      age: number;
    },
  ) {
    return this.adminService.createUser(body);
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      displayName?: string;
      age?: number;
      gender?: string;
      role?: string;
      plan?: string;
      tier?: string;
      currentStreak?: number;
      maxStreak?: number;
    },
  ) {
    // Standardize 'tier' and 'plan' so they are both in sync
    const planValue = body.plan || body.tier;
    const updatePayload = {
      ...body,
      plan: planValue,
      tier: planValue,
    };
    return this.adminService.updateUser(id, updatePayload);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteUser(id);
  }

  @Get('sentiments')
  async getAllSentiments() {
    return this.adminService.getSentiments();
  }

  @Delete('sentiments/:id')
  async deleteSentiment(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteSentiment(id);
  }
}
