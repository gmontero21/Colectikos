import prisma from './src/lib/prisma';
async function main() {
  await prisma.sponsor.updateMany({
    where: { nombre: "Ohana Food & Drinks" },
    data: {
      sitioWeb: "ohanafood.com",
      fotoExtra1: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1599&auto=format&fit=crop",
      fotoExtra2: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000&auto=format&fit=crop"
    }
  });
  console.log("Updated Ohana Food & Drinks");
}
main().catch(console.error).finally(() => prisma.$disconnect());
