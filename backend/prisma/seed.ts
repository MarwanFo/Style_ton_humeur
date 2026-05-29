import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@aurastudio.com';

  // Idempotent: skip if the admin already exists
  const existing = await prisma.user.findFirst({ where: { email: adminEmail } });
  if (existing) {
    console.log(`✅ Admin already exists: ${adminEmail}`);
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      displayName: 'Administrateur',
      gender: 'N/A',
      age: 0,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin account created successfully:`);
  console.log(`   Email    : ${admin.email}`);
  console.log(`   Password : admin123`);
  console.log(`   Role     : ${admin.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
