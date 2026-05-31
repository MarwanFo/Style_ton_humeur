import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [total_users, total_checkins, streaks, total_badges_unlocked, moodGroups] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.dailyCheckIn.count(),
      this.prisma.streak.aggregate({
        _avg: {
          currentStreak: true,
        },
      }),
      this.prisma.userBadge.count(),
      this.prisma.dailyCheckIn.groupBy({
        by: ['moodSelected'],
        _count: {
          id: true,
        },
      }),
    ]);

    const mood_distribution: Record<string, number> = {
      joyeux: 0,
      calme: 0,
      confiant: 0,
      stressé: 0,
      nostalgique: 0,
    };

    moodGroups.forEach((group) => {
      const mood = group.moodSelected ? group.moodSelected.toLowerCase() : 'calme';
      // Mappage si nécessaire pour correspondre aux clés attendues
      let mappedMood = mood;
      if (mood === 'audacieux') mappedMood = 'confiant';
      if (mood === 'fatigué') mappedMood = 'nostalgique';
      
      if (mood_distribution.hasOwnProperty(mappedMood)) {
        mood_distribution[mappedMood] += group._count.id;
      }
    });

    return {
      total_users,
      total_checkins,
      avg_streak: streaks._avg.currentStreak ? Math.round(streaks._avg.currentStreak * 10) / 10 : 0,
      total_badges_unlocked,
      mood_distribution,
    };
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        age: true,
        role: true,
        plan: true,
        twoFactorEnabled: true,
        createdAt: true,
        streak: {
          select: {
            currentStreak: true,
            maxStreak: true,
          },
        },
        _count: {
          select: {
            dailyCheckIns: true,
            recommendations: true,
            userBadges: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createUser(data: {
    email: string;
    pass: string;
    displayName: string;
    gender: string;
    age: number;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new ConflictException('Email déjà utilisé.');
    }

    const passwordHash = await bcrypt.hash(data.pass, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        displayName: data.displayName,
        gender: data.gender,
        age: Number(data.age),
        role: 'USER',
        plan: 'FREE',
        streak: {
          create: {
            currentStreak: 0,
            maxStreak: 0,
          },
        },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        age: true,
        role: true,
        plan: true,
        createdAt: true,
      },
    });
  }

  async updateUser(
    id: number,
    data: {
      displayName?: string;
      age?: number;
      gender?: string;
      role?: string;
      plan?: string;
      currentStreak?: number;
      maxStreak?: number;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    const { currentStreak, maxStreak, ...userFields } = data;

    // Build update object
    const updatePayload: any = { ...userFields };
    if (userFields.age !== undefined) {
      updatePayload.age = Number(userFields.age);
    }

    // Handle nested streak updates if provided
    if (currentStreak !== undefined || maxStreak !== undefined) {
      const streakUpdate: any = {};
      if (currentStreak !== undefined) streakUpdate.currentStreak = Number(currentStreak);
      if (maxStreak !== undefined) streakUpdate.maxStreak = Number(maxStreak);

      updatePayload.streak = {
        upsert: {
          create: {
            currentStreak: Number(currentStreak || 0),
            maxStreak: Number(maxStreak || 0),
          },
          update: streakUpdate,
        },
      };
    }

    return this.prisma.user.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        age: true,
        role: true,
        plan: true,
        streak: {
          select: {
            currentStreak: true,
            maxStreak: true,
          },
        },
      },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    await this.prisma.user.delete({ where: { id } });
    return { success: true, message: 'Utilisateur supprimé avec succès.' };
  }
}
