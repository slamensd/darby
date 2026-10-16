export const SRC = {
  nydos: 'https://apps.dos.ny.gov/publicInquiry/',
  importgenius: 'https://www.importgenius.com/importers/darby-trading-incorporated',
  importinfo: 'https://www.importinfo.com/darby-trading-incorporated',
  importinfoInc: 'https://www.importinfo.com/darby-inc',
  panjiva: 'https://panjiva.com/Darby-Trading-Inc/5098454',
  rspo: 'https://rspo.org/members/2-1713-26-000-00/',
  cbp1: 'https://rulings.cbp.gov/ruling/H312647',
  cbp2: 'https://rulings.cbp.gov/ruling/H312954',
  linkedin: 'https://www.linkedin.com/company/darby-trading-inc',
  ryan: 'https://www.linkedin.com/in/ryan-j-fales-83b1932',
  openfda: 'https://api.fda.gov/food/enforcement.json?search=recalling_firm:%22darby%22',
};

export const CONTACT = {
  phone: '+1 914 701 0003',
  tel: 'tel:+19147010003',
  email: 'info@darbyinc.com',
  address: ['Darby Trading Incorporated', '3000 Westchester Ave, Suite 200A', 'Purchase, NY 10577'],
};

export type Line = 'animal' | 'food';
export type Product = {
  slug: string;
  name: string;
  line: Line;
  plain: string;
  apps: string[];
  hs?: string;
  ruling?: string;
};

export const APPS = [
  'Dairy and beef rations',
  'Compound chocolate and coatings',
  'Industrial bakery',
  'Frying',
  'Nutrition oils',
  'Feed additives',
];

const s = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const p = (name: string, line: Line, plain: string, apps: string[], hs?: string, ruling?: string): Product => ({ slug: s(name), name, line, plain, apps, hs, ruling });

const D = 'Dairy and beef rations';
export const PRODUCTS: Product[] = [
  p('DT80', 'animal', 'Palmitic acid 85% rumen-protected fat for dairy rations.', [D], '3823.19.20', 'H312647 · H312954'),
  p('DT Calcium Salt', 'animal', 'Calcium salts of palm fatty acids for ration energy.', [D]),
  p('DT98', 'animal', 'Palm-based fatty acid for dairy and beef rations.', [D], '2915.70.0110', 'H312954'),
  p('DT100', 'animal', 'Palm-based fatty acid for dairy and beef rations.', [D], '3823.19.20', 'H312954'),
  p('DT ProFat 85', 'animal', 'Rumen-protected palm fat for energy-dense rations.', [D]),
  p('DT Omega 22', 'animal', 'Fat supplement for dairy and beef rations.', [D]),
  p('DT Ultra Cal 60', 'animal', 'Calcium salt fat supplement for ruminant rations.', [D]),
  p('DT Ultra Cal 70', 'animal', 'Calcium salt fat supplement for ruminant rations.', [D]),
  p('Tri Fat 75', 'animal', 'Palm-based fat blend for ruminant rations.', [D]),
  p('Potassium Carbonate', 'animal', 'Feed-grade potassium carbonate for ration formulation.', ['Feed additives']),
  p('Cocoa Butter Replacer', 'food', 'Replacer fat for compound chocolate and coatings.', ['Compound chocolate and coatings']),
  p('CHOCH 9503', 'food', 'Confectionery coating fat for compound chocolate.', ['Compound chocolate and coatings']),
  p('CHOCH 7011-XC', 'food', 'Confectionery coating fat for compound chocolate.', ['Compound chocolate and coatings']),
  p('CHOCH 3840', 'food', 'Confectionery coating fat for compound chocolate.', ['Compound chocolate and coatings']),
  p('Shortening 4852', 'food', 'Palm-based shortening for industrial bakery lines.', ['Industrial bakery']),
  p('Shortening 4143', 'food', 'Palm-based shortening for industrial bakery lines.', ['Industrial bakery']),
  p('Fry Shortening', 'food', 'Palm-based shortening for commercial frying.', ['Frying']),
  p('Gold Margarine Premium', 'food', 'Bakery margarine for laminated and baked goods.', ['Industrial bakery']),
  p('Hydro Palm Flakes', 'food', 'Hydrogenated palm flakes for bakery and blending.', ['Industrial bakery']),
  p('Butter Oil Substitute', 'food', 'Vegetable fat that stands in for butter oil.', ['Industrial bakery', 'Compound chocolate and coatings']),
  p('Vegetable Spread', 'food', 'Vegetable fat spread for bakery and food service.', ['Industrial bakery']),
  p('MCT', 'food', 'Medium-chain triglyceride oil, supplied in bulk.', ['Nutrition oils']),
  p('RCNO', 'food', 'Refined coconut oil, supplied in bulk.', ['Nutrition oils', 'Frying']),
];

export const MARKETS = [
  { name: 'Dairy and beef nutrition', line: 'More energy per pound of ration', to: '/products?line=animal', tone: '#2F4A2A', tint: '#B9D6B0' },
  { name: 'Bakery', line: 'Fats that hold up on the line', to: '/products?app=Industrial%20bakery', tone: '#7A5A2E', tint: '#EFDEC1' },
  { name: 'Confectionery', line: 'Coatings that set clean and snap', to: '/products?app=Compound%20chocolate%20and%20coatings', tone: '#4A2E2A', tint: '#E8CFCA' },
  { name: 'Distributors and blenders', line: 'We carry the import. You carry the product.', to: '/trade-finance', tone: '#10263A', tint: '#C8D0D8' },
];

export const ORIGINS = [
  { port: 'Kaohsiung', n: 476 }, { port: 'Singapore', n: 425 }, { port: 'Laem Chabang', n: 101 }, { port: 'Hong Kong', n: 100 },
  { port: 'Belawan', n: 65 }, { port: 'Pusan', n: 62 }, { port: 'Shanghai', n: 50 }, { port: 'Kajang', n: 47 },
  { port: 'Haifa', n: 43 }, { port: 'Tanjung Pelepas', n: 24 },
];
export const DISCHARGE = [
  { port: 'Tacoma', n: 632 }, { port: 'Oakland', n: 345 }, { port: 'Baltimore', n: 315 }, { port: 'Savannah', n: 105 },
  { port: 'Norfolk', n: 73 }, { port: 'Seattle', n: 39 }, { port: 'Philadelphia', n: 35 }, { port: 'Los Angeles', n: 20 },
  { port: 'Long Beach', n: 11 }, { port: 'Brownsville', n: 11 },
];
export const WAREHOUSES = [
  { city: 'Tacoma', lngLat: [-122.4443, 47.2529] as [number, number], coast: 'Pacific Northwest', x: 120, y: 70 },
  { city: 'Oakland', lngLat: [-122.2712, 37.8044] as [number, number], coast: 'Northern California', x: 95, y: 170 },
  { city: 'Los Angeles', lngLat: [-118.2437, 34.0522] as [number, number], coast: 'Southern California', x: 135, y: 235 },
  { city: 'Houston', lngLat: [-95.3698, 29.7604] as [number, number], coast: 'Gulf Coast', x: 430, y: 300 },
  { city: 'Savannah', lngLat: [-81.0912, 32.0809] as [number, number], coast: 'Southeast', x: 660, y: 245 },
  { city: 'Baltimore', lngLat: [-76.6122, 39.2904] as [number, number], coast: 'Mid-Atlantic', x: 705, y: 150 },
];
export const PRODUCERS = [
  'Evyap Sabun Malaysia', 'PT Permata Hijau Palm Oleo', 'Natural Oleochemicals', 'Ecolex', 'Volac Wilmar',
  'Wilmar Nabati', 'IOI Pan-Century', 'PT Asiapalm Oleo Jaya', 'PT Nutripro Prima Asia',
];

export const TIMELINE = [
  { y: '1992', t: 'Darby Trading, Inc. files in New York.', src: SRC.nydos, s: 'NY DOS' },
  { y: '2001', t: 'Current entity, Darby Trading Incorporated, files in New York.', src: SRC.nydos, s: 'NY DOS' },
  { y: '2006', t: 'First containers landed for US customers on the customs record.', src: SRC.importgenius, s: 'ImportGenius' },
  { y: '2013', t: 'Rumen-protected fats become the main business.', src: SRC.importinfo, s: 'ImportInfo' },
  { y: '2021', t: 'US Customs settles the classification of the DT line.', src: SRC.cbp2, s: 'CBP' },
  { y: '2026', t: 'RSPO member. Bakery and confectionery fats added.', src: SRC.rspo, s: 'RSPO' },
];
