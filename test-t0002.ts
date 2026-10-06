import prisma from './src/lib/prisma';
async function main() {
  const t0002 = await prisma.sponsor.findUnique({ where: { id: "T0002" }, include: { destinosEnRuta: { include: { lugar: true } } } });
  console.log(JSON.stringify(t0002, null, 2));
}
main();
