import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createBadgeDto: CreateBadgeDto) {
    return this.badgesService.create(createBadgeDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBadgeDto: UpdateBadgeDto) {
    return this.badgesService.update(id, updateBadgeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.remove(id);
  }
}
