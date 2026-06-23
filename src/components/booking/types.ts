import func2url from '../../../backend/func2url.json';

export const SECTORS_URL = func2url['sectors'];

// ─── Типы ────────────────────────────────────────────────────────
export type Tier = 'platinum' | 'bronze' | 'standard' | 'vip' | 'corner' | 'press';

export interface SectorDef {
  id: string;
  label: string;
  tier: Tier;
  price: number;
  rows: number;
  seats: number;
}

export interface SelectedSeat {
  key: string;
  row: number;
  seat: number;
  price: number;
  sectorId: string;
  sectorLabel: string;
}

// ─── Цвета категорий ─────────────────────────────────────────────
export const TIER_COLOR: Record<Tier, string> = {
  platinum: '#e6c96e',
  bronze:   '#D62027',
  standard: '#d0378e',  // малиновый — как на схеме
  vip:      '#3eb89a',  // бирюзовый — как на схеме
  corner:   '#7B5EA7',  // фиолетовый
  press:    '#888',
};

export const TIER_LABEL: Record<Tier, string> = {
  platinum: 'Platinum',
  bronze:   'Bronze',
  standard: 'Стандарт',
  vip:      'VIP',
  corner:   'Угловой',
  press:    'Пресса',
};

export const TIER_PRICE_LABEL: Record<Tier, string> = {
  platinum: '12 000₽',
  bronze:   '3 500₽',
  standard: '1 800₽',
  vip:      '5 500₽',
  corner:   '2 500₽',
  press:    'нет в продаже',
};

// ─── Все секторы по реальной схеме ───────────────────────────────
// Западная трибуна A (верх): A1–A8 + Platinum A4/A5 + Bronze A3/A6 + Press
// Южная трибуна D (лево): D119–D125 (низ), D224–D233 (угол)
// Северная трибуна B (право): B101–B107 (низ), B201–B210 (угол)
// Восточная трибуна C (низ): C109–C119 (1й ярус), C212–C223 (2й ярус)

export const SECTORS: SectorDef[] = [
  // Западная A — 1й ярус
  { id: 'A1',       label: 'A1',       tier: 'bronze',   price: 3500,  rows: 20, seats: 22 },
  { id: 'A2',       label: 'A2',       tier: 'bronze',   price: 3500,  rows: 20, seats: 22 },
  { id: 'A3',       label: 'A3\nБронза', tier: 'bronze', price: 3500,  rows: 20, seats: 22 },
  { id: 'A4',       label: 'A4',       tier: 'platinum', price: 12000, rows: 16, seats: 18 },
  { id: 'A5',       label: 'A5',       tier: 'platinum', price: 12000, rows: 16, seats: 18 },
  { id: 'A6',       label: 'A6\nБронза', tier: 'bronze', price: 3500,  rows: 20, seats: 22 },
  { id: 'A7',       label: 'A7',       tier: 'bronze',   price: 3500,  rows: 20, seats: 22 },
  { id: 'A8',       label: 'A8\nПресса', tier: 'press',  price: 0,     rows: 12, seats: 14 },
  // Южная D — нижний ярус
  { id: 'D119',     label: 'D119',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'D120',     label: 'D120',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'D121',     label: 'D121',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'D122',     label: 'D122',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'D123',     label: 'D123',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'D124',     label: 'D124',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'D125',     label: 'D125',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  // Южная D — верхний ярус (угловые)
  { id: 'D224',     label: 'D224',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D225',     label: 'D225',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D226',     label: 'D226',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D227',     label: 'D227',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D228',     label: 'D228',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D229',     label: 'D229',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D230',     label: 'D230',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D231',     label: 'D231',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D232',     label: 'D232',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'D233',     label: 'D233',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  // Северная B — нижний ярус
  { id: 'B101',     label: 'B101',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'B102',     label: 'B102',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'B103',     label: 'B103',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'B104',     label: 'B104',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'B105',     label: 'B105',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'B106',     label: 'B106',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'B107',     label: 'B107',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  // Северная B — верхний ярус (угловые)
  { id: 'B201',     label: 'B201',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B202',     label: 'B202',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B203',     label: 'B203',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B204',     label: 'B204',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B205',     label: 'B205',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B206',     label: 'B206',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B207',     label: 'B207',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B208',     label: 'B208',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B209',     label: 'B209',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'B210',     label: 'B210',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  // Восточная C — нижний ярус
  { id: 'C109',     label: 'C109',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C110',     label: 'C110',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C111',     label: 'C111',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C112',     label: 'C112',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C113',     label: 'C113',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C114',     label: 'C114',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C115',     label: 'C115',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C116',     label: 'C116',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  // Восточная C — верхний ярус
  { id: 'C211',     label: 'C211',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C212',     label: 'C212',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C213',     label: 'C213',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C214',     label: 'C214',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C215',     label: 'C215',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C216',     label: 'C216',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C217',     label: 'C217',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C218',     label: 'C218',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C219',     label: 'C219',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C220',     label: 'C220',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
];

export const SECTOR_MAP: Record<string, SectorDef> = {};
SECTORS.forEach(s => { SECTOR_MAP[s.id] = s; });

// ─── Занятые места ────────────────────────────────────────────────
export function makeOccupied(rows: number, seats: number, seed: number) {
  const set = new Set<string>();
  for (let r = 0; r < rows; r++)
    for (let s = 0; s < seats; s++)
      if ((r * 5 + s * 7 + seed) % 9 === 0) set.add(`${r}-${s}`);
  return set;
}
export const OCC: Record<string, Set<string>> = {};
SECTORS.forEach((s, i) => { OCC[s.id] = makeOccupied(s.rows, s.seats, i * 4 + 1); });

// ─── Применение данных из базы (цены/места) поверх схемы ──────────
export function applyDbSectors(rows: { id: string; label: string; tier: Tier; price: number; rows: number; seats: number }[]) {
  rows.forEach((r, i) => {
    if (SECTOR_MAP[r.id]) {
      const prev = SECTOR_MAP[r.id];
      SECTOR_MAP[r.id] = { ...prev, tier: r.tier, price: r.price, rows: r.rows, seats: r.seats };
      if (prev.rows !== r.rows || prev.seats !== r.seats) {
        OCC[r.id] = makeOccupied(r.rows, r.seats, i * 4 + 1);
      }
    }
  });
}

// ─── SVG-схема: константы ─────────────────────────────────────────
// Стадион прямоугольный с закруглёнными углами — как на картинке
export const SW = 760, SH = 680;
// Поле (газон) — по центру, немного смещён вниз-вправо как на схеме
export const FIELD = { x: 185, y: 130, w: 390, h: 280 };
// Внутренний периметр (дорожка)
export const INNER = { x: 155, y: 108, w: 450, h: 326 };

// Цвет сектора с учётом состояния
export function sColor(id: string, active: string | null, hovered: string | null) {
  const s = SECTOR_MAP[id];
  if (!s) return '#1a1a1a';
  const base = TIER_COLOR[s.tier];
  if (id === active) return base;
  if (id === hovered) return base + 'cc';
  if (active) return base + '33';
  return base + '88';
}

// ─── Пропсы схемы ─────────────────────────────────────────────────
export interface StadiumMapProps {
  active: string | null;
  hovered: string | null;
  onEnter: (id: string) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}