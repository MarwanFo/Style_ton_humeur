import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/style_ton_humeur';
    const regex = /mysql:\/\/([^:]*):([^@]*)@([^:]*):(\d+)\/(.+)/;
    const match = dbUrl.match(regex);
    
    let config: any = {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'style_ton_humeur',
      connectionLimit: 5,
    };

    if (match) {
      config = {
        user: match[1],
        password: match[2] || '',
        host: match[3],
        port: parseInt(match[4], 10),
        database: match[5],
        connectionLimit: 5,
      };
    }

    const adapter = new PrismaMariaDb(config);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
