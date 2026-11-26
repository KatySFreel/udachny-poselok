import troitskaya from './troitskaya-surroundings.json';

export type NearbyCategory = 'medicine' | 'education' | 'shops' | 'parks' | 'forest';
export type NearbyPoint = {
  id: string;
  category: NearbyCategory;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  boundary?: number[][];
  labelLines?: readonly [string,string];
};
export type SettlementSurroundings = {
  updatedAt: string;
  source: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  points: NearbyPoint[];
};
const troitskayaData: SettlementSurroundings = {
  ...troitskaya,
  points: troitskaya.points.map(point => ({
    ...point,
    category: point.category as NearbyCategory,
    ...(point.id === 'way/672201697' ? {labelLines: ['Радоновые источники и озёра','у деревни Лопухинка'] as const} : {}),
  })),
};
export function getSettlementSurroundings(slug: string): SettlementSurroundings | undefined {
  return slug === 'troitskaya-sloboda' ? troitskayaData : undefined;
}
