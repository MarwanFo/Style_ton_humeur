import { Controller, Get, Post, Patch, Delete, Param, Body, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Controller('admin/users')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        streak: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      gender: user.gender,
      age: user.age,
      role: user.role,
      tier: user.tier,
      streak: user.streak
        ? {
            currentStreak: user.streak.currentStreak,
            maxStreak: user.streak.maxStreak,
          }
        : { currentStreak: 0, maxStreak: 0 },
      createdAt: user.createdAt,
    }));
  }

  @Post()
  async createUser(
    @Body()
    body: {
      displayName: string;
      email: string;
      password?: string;
      age: number;
      gender: string;
    },
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password || 'password123', salt);

    const user = await this.prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        displayName: body.displayName,
        gender: body.gender,
        age: body.age,
        role: 'USER',
        tier: 'FREE',
        streak: {
          create: {
            currentStreak: 0,
            maxStreak: 0,
          },
        },
      },
      include: {
        streak: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      gender: user.gender,
      age: user.age,
      role: user.role,
      tier: user.tier,
      streak: {
        currentStreak: user.streak?.currentStreak || 0,
        maxStreak: user.streak?.maxStreak || 0,
      },
      createdAt: user.createdAt,
    };
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      displayName?: string;
      age?: number;
      gender?: string;
      role?: string;
      tier?: string;
      currentStreak?: number;
    },
  ) {
    const userId = parseInt(id, 10);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Update user properties
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        displayName: body.displayName,
        age: body.age,
        gender: body.gender,
        role: body.role,
        tier: body.tier,
      },
    });

    // Update streak if currentStreak is provided
    if (body.currentStreak !== undefined) {
      await this.prisma.streak.upsert({
        where: { userId },
        create: {
          userId,
          currentStreak: body.currentStreak,
          maxStreak: body.currentStreak,
        },
        update: {
          currentStreak: body.currentStreak,
        },
      });

      // Ensure maxStreak is at least currentStreak
      const streakRecord = await this.prisma.streak.findUnique({ where: { userId } });
      if (streakRecord && streakRecord.maxStreak < body.currentStreak) {
        await this.prisma.streak.update({
          where: { userId },
          data: { maxStreak: body.currentStreak },
        });
      }
    }

    const finalUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { streak: true },
    });

    return {
      id: finalUser?.id,
      email: finalUser?.email,
      displayName: finalUser?.displayName,
      gender: finalUser?.gender,
      age: finalUser?.age,
      role: finalUser?.role,
      tier: finalUser?.tier,
      streak: finalUser?.streak
        ? {
            currentStreak: finalUser.streak.currentStreak,
            maxStreak: finalUser.streak.maxStreak,
          }
        : { currentStreak: 0, maxStreak: 0 },
      createdAt: finalUser?.createdAt,
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  }
}
