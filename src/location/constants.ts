// constants.ts
export const LOCATION_CONFIG = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  GPS_TIMEOUT: 15000, // 15 seconds
  PERMISSION_COOLDOWN: 30 * 1000, // 30 seconds between permission requests
} as const;

export const YAOUNDE_CENTER = {
  latitude: 3.8667,
  longitude: 11.5167,
} as const;

export const CAMEROON_BOUNDS = {
  MIN_LAT: 1.0,
  MAX_LAT: 13.0,
  MIN_LNG: 8.0,
  MAX_LNG: 16.0,
} as const;

export const YAOUNDE_NEIGHBORHOODS = [
  'Bastos',
  'Melen', 
  'Emana',
  'Essos',
  'Ngousso',
  'Kondengui',
  'Mvog-Ada',
  'Tsinga',
  'Omnisport',
  'Odza',
  'Nkomo',
  'Mokolo',
  'Mvan',
  'Djoungolo',
  'Nlongkak',
  'Ekounou',
  'Biyem-Assi',
] as const;

export const YAOUNDE_LANDMARKS = [
  'Palais des Congrès',
  'Stade Ahmadou Ahidjo',
  'Université de Yaoundé I',
  'Marché Central',
  'Hôtel de Ville',
  'Carrefour Warda',
  'Rond-point Nlongkak',
  'Carrefour Obili',
  'Rond-point Ekounou',
  'Carrefour Elig-Edzoa',
  'Pharmacie de la Poste',
  'Immeuble Ministère',
] as const;

// Validation helper
export const isValidCameroonCoordinate = (coord: { latitude: number; longitude: number }): boolean => {
  return (
    coord.latitude >= CAMEROON_BOUNDS.MIN_LAT &&
    coord.latitude <= CAMEROON_BOUNDS.MAX_LAT &&
    coord.longitude >= CAMEROON_BOUNDS.MIN_LNG &&
    coord.longitude <= CAMEROON_BOUNDS.MAX_LNG
  );
};

// Format address helper
export const formatYaoundeAddress = (address: {
  street?: string;
  neighborhood?: string;
  landmark?: string;
}): string => {
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.neighborhood) parts.push(address.neighborhood);
  if (address.landmark) parts.push(`près de ${address.landmark}`);
  parts.push('Yaoundé');
  return parts.join(', ');
};
