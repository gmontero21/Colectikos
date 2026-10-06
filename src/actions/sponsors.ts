"use server";

import prisma from '../lib/prisma';

// Haversine formula to calculate distance between two coordinates in kilometers
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export async function getSponsors() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        destinosEnRuta: {
          include: {
            lugar: {
              select: {
                id: true,
                nombre: true,
                nombre_en: true,
                imagenUrl: true,
                latitude: true,
                longitude: true,
                categoria: true
              }
            }
          }
        }
      }
    });
    return sponsors;
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    return [];
  }
}

export async function getNearbyPostcards(sponsorLat: number | null, sponsorLng: number | null, radiusKm = 10, manualDestinations: any[] = []) {
  try {
    let nearby: any[] = [];
    
    if (sponsorLat !== null && sponsorLng !== null) {
      // Fetch all postcards that have coordinates
      const postcards = await prisma.lugar.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
          isVisible: true,
          categoria: { not: 'PROVINCIA' }
        },
        select: {
          id: true,
          nombre: true,
          nombre_en: true,
          imagenUrl: true,
          latitude: true,
          longitude: true,
          categoria: true
        }
      });

      // Filter by Haversine distance
      nearby = postcards
        .map(p => {
          const distance = getDistanceFromLatLonInKm(
            sponsorLat,
            sponsorLng,
            p.latitude as number,
            p.longitude as number
          );
          return { ...p, distance };
        })
        .filter(p => p.distance <= radiusKm);
    }

    // Usar Map para combinar manuales sin duplicados (evitando que una manual ya esté cerca)
    const combinedMap = new Map();
    
    // Primero, agregamos las cercanas calculadas
    for (const p of nearby) {
      combinedMap.set(p.id, p);
    }

    // Luego, agregamos o sobreescribimos las manuales asignándoles distancia -1
    for (const manual of manualDestinations) {
      combinedMap.set(manual.id, {
        ...manual,
        distance: -1 // -1 significa "en ruta"
      });
    }

    // Convertimos a array y ordenamos:
    // Los -1 van primero (las paradas en ruta clave), luego por distancia de menor a mayor
    return Array.from(combinedMap.values()).sort((a, b) => {
      if (a.distance === -1 && b.distance !== -1) return -1;
      if (b.distance === -1 && a.distance !== -1) return 1;
      return a.distance - b.distance;
    });

  } catch (error) {
    console.error("Error calculating nearby postcards:", error);
    return [];
  }
}

export async function getSponsorsForDestination(postcardId: string, name: string, latitude: number | null, longitude: number | null) {
  try {
    const sponsors = await getSponsors();
    
    const sponsorsWithNearby = await Promise.all(sponsors.map(async (sponsor: any) => {
      const manualDestinations = (sponsor.destinosEnRuta || []).map((rel: any) => rel.lugar);
      const nearby = await getNearbyPostcards(sponsor.latitude, sponsor.longitude, 10, manualDestinations);
      return {
        ...sponsor,
        nearbyPostcards: nearby
      };
    }));

    // Filtrar los patrocinadores que incluyen esta postal (ya sea por ruta, proximidad, o emparejando por nombre para el mock data)
    const matchingSponsors = sponsorsWithNearby.filter(sponsor => 
      sponsor.nearbyPostcards.some((pc: any) => 
        pc.id === postcardId || 
        pc.nombre.toLowerCase() === name.toLowerCase()
      )
    );

    return matchingSponsors;
  } catch (error) {
    console.error("Error fetching sponsors for destination:", error);
    return [];
  }
}
