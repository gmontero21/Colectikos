export interface GamificationResult {
  titulo: string;
  isPerfectScore: boolean;
}

export function calcularNivel(porcentaje: number, genero: string, dictLevels?: any): GamificationResult {
  const isPerfectScore = Math.round(porcentaje) === 100;
  let titulo = '';
  const gen = (genero || 'NEUTRO').toUpperCase();
  const initial = gen.charAt(0);

  let key = '';
  if (porcentaje >= 0 && porcentaje < 20) {
    key = `0_20_${initial}`;
    if (gen === 'MASCULINO') titulo = 'Casero';
    else if (gen === 'FEMENINO') titulo = 'Casera';
    else titulo = 'Casero';
  } else if (porcentaje >= 20 && porcentaje < 40) {
    key = `20_40_${initial}`;
    if (gen === 'MASCULINO') titulo = 'Explorador Novato';
    else if (gen === 'FEMENINO') titulo = 'Exploradora Novata';
    else titulo = 'Explorador Novato';
  } else if (porcentaje >= 40 && porcentaje < 60) {
    key = `40_60_${initial}`;
    if (gen === 'MASCULINO') titulo = 'Paseador';
    else if (gen === 'FEMENINO') titulo = 'Paseadora';
    else titulo = 'Paseante';
  } else if (porcentaje >= 60 && porcentaje < 80) {
    key = `60_80_${initial}`;
    titulo = 'Turista';
  } else if (porcentaje >= 80 && porcentaje < 90) {
    key = `80_90_${initial}`;
    titulo = 'Conoche!';
  } else if (porcentaje >= 90) {
    key = `90_100_${initial}`;
    if (gen === 'MASCULINO') titulo = 'Tico100';
    else if (gen === 'FEMENINO') titulo = 'Tica100';
    else titulo = 'Tico100';
  }

  // Si se proporciona un diccionario, sobreescribe el título con el valor traducido
  if (dictLevels && key && dictLevels[key]) {
    titulo = dictLevels[key];
  }

  return {
    titulo,
    isPerfectScore
  };
}
