import prisma from './src/lib/prisma';

async function main() {
  const user = await prisma.user.findFirst({
    where: { username: 'gmontero21' }
  });
  console.log("DB USER:", user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
