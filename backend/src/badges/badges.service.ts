import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.badge.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async create(createBadgeDto: CreateBadgeDto) {
    const { thresholdDays, ...rest } = createBadgeDto;
    return this.prisma.badge.create({
      data: {
        ...rest,
        criteria: { thresholdDays },
      },
    });
  }

  async update(id: number, updateBadgeDto: UpdateBadgeDto) {
    const badge = await this.prisma.badge.findUnique({ where: { id } });
    if (!badge) throw new NotFoundException(`Badge #${id} not found`);

    const { thresholdDays, ...rest } = updateBadgeDto as any;
    
    return this.prisma.badge.update({
      where: { id },
      data: {
        ...rest,
        ...(thresholdDays ? { criteria: { thresholdDays } } : {}),
      },
    });
  }

  async remove(id: number) {
    const badge = await this.prisma.badge.findUnique({ where: { id } });
    if (!badge) throw new NotFoundException(`Badge #${id} not found`);

    return this.prisma.badge.delete({
      where: { id },
    });
  }
}
