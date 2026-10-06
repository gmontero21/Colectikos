import prisma from './src/lib/prisma';
import { getSponsorsForDestination } from './src/actions/sponsors';

async function main() {
  const sponsors = await prisma.sponsor.findMany({ include: { destinosEnRuta: true } });
  console.log("Sponsors:", sponsors.map(s => s.nombre));

  const volcanBarva = await prisma.lugar.findFirst({ where: { nombre: { contains: "Barva" } } });
  if (volcanBarva) {
    console.log("Found Barva:", volcanBarva.id, volcanBarva.nombre, volcanBarva.latitude, volcanBarva.longitude);
    const result = await getSponsorsForDestination(volcanBarva.id, volcanBarva.latitude, volcanBarva.longitude);
    console.log("Matching Sponsors for Barva:", result.map(s => s.nombre));
  } else {
    console.log("No Barva found.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
