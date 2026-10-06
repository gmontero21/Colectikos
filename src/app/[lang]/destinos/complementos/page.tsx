import React from 'react';
import ComplementosClient from './ComplementosClient';
import { getSponsors, getNearbyPostcards } from '../../../../actions/sponsors';

export default async function Page() {
  const sponsors = await getSponsors();
  
  // Calculate nearby postcards for each sponsor at request time
  const sponsorsWithNearby = await Promise.all(sponsors.map(async (sponsor: any) => {
    // Calcular cercanas + integrar destinos en ruta (mapeando la relación explícita)
    const manualDestinations = (sponsor.destinosEnRuta || []).map((rel: any) => rel.lugar);
    const nearby = await getNearbyPostcards(sponsor.latitude, sponsor.longitude, 10, manualDestinations);
    return {
      ...sponsor,
      nearbyPostcards: nearby
    };
  }));

  return <ComplementosClient sponsors={sponsorsWithNearby} />;
}
