const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('./node_modules/.prisma/client');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findFirst({ where: { username: 'gmontero21' } });
  console.log("USER:", user.currentStreak, user.lastLoginDate);
}
main().finally(() => prisma.$disconnect());
