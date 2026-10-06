const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const sponsors = await prisma.sponsor.findMany({ select: { nombre: true, sitioWeb: true, fotoExtra1: true, fotoExtra2: true } });
  console.log(JSON.stringify(sponsors, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
