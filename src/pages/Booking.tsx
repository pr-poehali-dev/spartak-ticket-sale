import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

// ─── Типы ────────────────────────────────────────────────────────
type Tier = 'platinum' | 'bronze' | 'standard' | 'vip' | 'corner' | 'press';

interface SectorDef {
  id: string;
  label: string;
  tier: Tier;
  price: number;
  rows: number;
  seats: number;
}

interface SelectedSeat {
  key: string;
  row: number;
  seat: number;
  price: number;
  sectorId: string;
  sectorLabel: string;
}

// ─── Цвета категорий ─────────────────────────────────────────────
const TIER_COLOR: Record<Tier, string> = {
  platinum: '#e6c96e',
  bronze:   '#D62027',
  standard: '#d0378e',  // малиновый — как на схеме
  vip:      '#3eb89a',  // бирюзовый — как на схеме
  corner:   '#7B5EA7',  // фиолетовый
  press:    '#888',
};

const TIER_LABEL: Record<Tier, string> = {
  platinum: 'Platinum',
  bronze:   'Bronze',
  standard: 'Стандарт',
  vip:      'VIP',
  corner:   'Угловой',
  press:    'Пресса',
};

const TIER_PRICE_LABEL: Record<Tier, string> = {
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

const SECTORS: SectorDef[] = [
  // Западная A — 1й ярус
  { id: 'A1',       label: 'A1',       tier: 'bronze',   price: 3500,  rows: 20, seats: 22 },
  { id: 'A2',       label: 'A2',       tier: 'bronze',   price: 3500,  rows: 20, seats: 22 },
  { id: 'A3',       label: 'A3',       tier: 'bronze',   price: 3500,  rows: 20, seats: 22 },
  { id: 'A4',       label: 'A4',       tier: 'platinum', price: 12000, rows: 16, seats: 18 },
  { id: 'A5',       label: 'A5',       tier: 'platinum', price: 12000, rows: 16, seats: 18 },
  { id: 'A6',       label: 'A6',       tier: 'bronze',   price: 3500,  rows: 20, seats: 22 },
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
  { id: 'C117',     label: 'C117',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C118',     label: 'C118',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
  { id: 'C119',     label: 'C119',     tier: 'standard', price: 1800,  rows: 16, seats: 18 },
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
  { id: 'C221',     label: 'C221',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C222',     label: 'C222',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
  { id: 'C223',     label: 'C223',     tier: 'corner',   price: 2500,  rows: 12, seats: 14 },
];

const SECTOR_MAP: Record<string, SectorDef> = {};
SECTORS.forEach(s => { SECTOR_MAP[s.id] = s; });

// ─── Занятые места ────────────────────────────────────────────────
function makeOccupied(rows: number, seats: number, seed: number) {
  const set = new Set<string>();
  for (let r = 0; r < rows; r++)
    for (let s = 0; s < seats; s++)
      if ((r * 5 + s * 7 + seed) % 9 === 0) set.add(`${r}-${s}`);
  return set;
}
const OCC: Record<string, Set<string>> = {};
SECTORS.forEach((s, i) => { OCC[s.id] = makeOccupied(s.rows, s.seats, i * 4 + 1); });

// ─── SVG-схема: константы ─────────────────────────────────────────
// Стадион прямоугольный с закруглёнными углами — как на картинке
const SW = 760, SH = 680;
// Поле (газон) — по центру, немного смещён вниз-вправо как на схеме
const FIELD = { x: 185, y: 130, w: 390, h: 280 };
// Внутренний периметр (дорожка)
const INNER = { x: 155, y: 108, w: 450, h: 326 };

// Цвет сектора с учётом состояния
function sColor(id: string, active: string | null, hovered: string | null) {
  const s = SECTOR_MAP[id];
  if (!s) return '#1a1a1a';
  const base = TIER_COLOR[s.tier];
  if (id === active) return base;
  if (id === hovered) return base + 'cc';
  if (active) return base + '33';
  return base + '88';
}

// ─── Компонент схемы ─────────────────────────────────────────────
interface StadiumMapProps {
  active: string | null;
  hovered: string | null;
  onEnter: (id: string) => void;
  onLeave: () => void;
  onClick: (id: string) => void;
}

function SectorRect({
  id, x, y, w, h, rx = 3,
  active, hovered, onEnter, onLeave, onClick, fontSize = 7.5,
}: {
  id: string; x: number; y: number; w: number; h: number; rx?: number;
  fontSize?: number;
} & StadiumMapProps) {
  const s = SECTOR_MAP[id];
  if (!s) return null;
  const isActive = active === id;
  const isHov = hovered === id;
  const fill = sColor(id, active, hovered);
  const textFill = (isActive || isHov) ? '#fff' : '#ddd';
  const isPress = s.tier === 'press';
  return (
    <g
      onClick={() => !isPress && onClick(id)}
      onMouseEnter={() => onEnter(id)}
      onMouseLeave={onLeave}
      style={{ cursor: isPress ? 'default' : 'pointer' }}
    >
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill}
        stroke={isActive ? '#fff' : isHov ? '#fff8' : '#1118'}
        strokeWidth={isActive ? 1.5 : 0.8}
        style={{ transition: 'fill 0.15s, stroke 0.15s' }}
      />
      {s.label.split('\n').map((line, i) => (
        <text key={i} x={x + w / 2} y={y + h / 2 + (i - (s.label.includes('\n') ? 0.5 : 0)) * (fontSize + 1)}
          textAnchor="middle" dominantBaseline="middle"
          fill={textFill} fontSize={fontSize}
          fontFamily="Oswald, sans-serif" fontWeight="700"
          style={{ pointerEvents: 'none', transition: 'fill 0.15s' }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function StadiumMap(props: StadiumMapProps) {
  const { hovered, active } = props;
  // Tooltip
  const hovS = hovered ? SECTOR_MAP[hovered] : null;

  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} className="w-full"
      style={{ filter: 'drop-shadow(0 0 32px rgba(214,32,39,0.12))' }}>
      {/* Фон */}
      <rect width={SW} height={SH} fill="#0b0b0b" rx="12" />

      {/* ── ЗАПАДНАЯ ТРИБУНА A (сверху) ─────────────────────── */}
      {/* Ярус 1: A1–A8 — прямоугольники по всей ширине сверху */}
      {/* A1 */ }
      <SectorRect id="A1" x={158} y={28} w={52} h={46} {...props} />
      <SectorRect id="A2" x={214} y={18} w={52} h={56} {...props} />
      <SectorRect id="A3" x={270} y={12} w={52} h={62} {...props} />
      {/* A4 Platinum */}
      <SectorRect id="A4" x={326} y={8}  w={52} h={66} {...props} fontSize={7} />
      {/* A5 Platinum */}
      <SectorRect id="A5" x={382} y={8}  w={52} h={66} {...props} fontSize={7} />
      <SectorRect id="A6" x={438} y={12} w={52} h={62} {...props} />
      <SectorRect id="A7" x={494} y={18} w={52} h={56} {...props} />
      <SectorRect id="A8" x={548} y={28} w={54} h={46} {...props} fontSize={7} />

      {/* Подпись трибуны A */}
      <text x={SW / 2} y={84} textAnchor="middle" fill="#444" fontSize="9"
        fontFamily="Oswald" fontWeight="700" letterSpacing="3">ЗАПАДНАЯ ТРИБУНА A</text>

      {/* ── ЮЖНАЯ ТРИБУНА D (слева) ─────────────────────────── */}
      {/* Нижний ярус D119–D125 */}
      {[['D119',114,492],['D120',114,448],['D121',114,404],
        ['D122',114,360],['D123',114,316],['D124',114,272],['D125',114,228]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={40} h={40} {...props} fontSize={6.5} />
      ))}
      {/* Верхний ярус D224–D233 */}
      {[['D224',62,552],['D225',62,516],['D226',62,480],['D227',62,444],
        ['D228',62,408],['D229',62,372],['D230',62,336],
        ['D231',62,300],['D232',62,264],['D233',62,228]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={40} h={36} {...props} fontSize={6} />
      ))}
      {/* Подпись */}
      <text x={76} y={SH/2} textAnchor="middle" fill="#444" fontSize="8"
        fontFamily="Oswald" fontWeight="700" letterSpacing="2"
        transform={`rotate(-90,76,${SH/2})`}>ЮЖНАЯ ТРИБУНА D</text>

      {/* ── СЕВЕРНАЯ ТРИБУНА B (справа) ─────────────────────── */}
      {/* Нижний ярус B101–B107 */}
      {[['B101',606,228],['B102',606,272],['B103',606,316],
        ['B104',606,360],['B105',606,404],['B106',606,448],['B107',606,492]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={40} h={40} {...props} fontSize={6.5} />
      ))}
      {/* Верхний ярус B201–B210 */}
      {[['B201',650,228],['B202',650,264],['B203',650,300],['B204',650,336],
        ['B205',650,372],['B206',650,408],['B207',650,444],
        ['B208',650,480],['B209',650,516],['B210',650,552]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={40} h={36} {...props} fontSize={6} />
      ))}
      {/* Подпись */}
      <text x={SW - 76} y={SH/2} textAnchor="middle" fill="#444" fontSize="8"
        fontFamily="Oswald" fontWeight="700" letterSpacing="2"
        transform={`rotate(90,${SW-76},${SH/2})`}>СЕВЕРНАЯ ТРИБУНА B</text>

      {/* ── ВОСТОЧНАЯ ТРИБУНА C (снизу) ─────────────────────── */}
      {/* Нижний ярус C109–C119 */}
      {[['C119',158,596],['C118',210,596],['C117',262,596],['C116',314,596],
        ['C115',366,596],['C114',418,596],['C113',470,596],
        ['C112',522,596],['C111',574,596]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={48} h={38} {...props} fontSize={6.5} />
      ))}
      {[['C110',158,638],['C109',210,638]].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={48} h={36} {...props} fontSize={6.5} />
      ))}
      {/* Верхний ярус C212–C223 */}
      {[['C223',112,638],['C222',158,638],['C221',204,638],['C220',250,638],
        ['C219',296,638],['C218',342,638],['C217',388,638],['C216',434,638],
        ['C215',480,638],['C214',526,638],['C213',572,638],['C212',618,638],['C211',664,638]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={44} h={34} {...props} fontSize={5.8} />
      ))}
      {/* Подпись */}
      <text x={SW/2} y={592} textAnchor="middle" fill="#444" fontSize="9"
        fontFamily="Oswald" fontWeight="700" letterSpacing="3">ВОСТОЧНАЯ ТРИБУНА C</text>

      {/* ── Внутренний буфер ─────────────────────────────────── */}
      <rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h}
        rx="12" fill="#111" stroke="#1e1e1e" strokeWidth="1" />

      {/* ── ПОЛЕ ─────────────────────────────────────────────── */}
      {/* Полосы газона */}
      <defs>
        <clipPath id="fieldClip">
          <rect x={FIELD.x} y={FIELD.y} width={FIELD.w} height={FIELD.h} rx="4" />
        </clipPath>
      </defs>
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <rect key={i} x={FIELD.x + i * (FIELD.w / 10)} y={FIELD.y}
          width={FIELD.w / 10} height={FIELD.h}
          fill={i % 2 === 0 ? '#1a6b2a' : '#1e7830'}
          clipPath="url(#fieldClip)"
        />
      ))}
      <rect x={FIELD.x} y={FIELD.y} width={FIELD.w} height={FIELD.h}
        rx="4" fill="none" stroke="#24903a" strokeWidth="1.5" />
      {/* Центральная линия */}
      <line x1={FIELD.x + FIELD.w/2} y1={FIELD.y} x2={FIELD.x + FIELD.w/2} y2={FIELD.y + FIELD.h}
        stroke="#24903a" strokeWidth="1.5" />
      {/* Центральный круг */}
      <circle cx={FIELD.x + FIELD.w/2} cy={FIELD.y + FIELD.h/2} r={FIELD.h * 0.25}
        fill="none" stroke="#24903a" strokeWidth="1.5" />
      <circle cx={FIELD.x + FIELD.w/2} cy={FIELD.y + FIELD.h/2} r="4" fill="#24903a" />
      {/* Штрафная левая */}
      <rect x={FIELD.x} y={FIELD.y + FIELD.h*0.25} width={FIELD.w * 0.16} height={FIELD.h * 0.5}
        fill="none" stroke="#24903a" strokeWidth="1.2" />
      <rect x={FIELD.x} y={FIELD.y + FIELD.h*0.37} width={FIELD.w * 0.06} height={FIELD.h * 0.26}
        fill="none" stroke="#24903a" strokeWidth="1.2" />
      {/* Штрафная правая */}
      <rect x={FIELD.x + FIELD.w * 0.84} y={FIELD.y + FIELD.h*0.25} width={FIELD.w * 0.16} height={FIELD.h * 0.5}
        fill="none" stroke="#24903a" strokeWidth="1.2" />
      <rect x={FIELD.x + FIELD.w * 0.94} y={FIELD.y + FIELD.h*0.37} width={FIELD.w * 0.06} height={FIELD.h * 0.26}
        fill="none" stroke="#24903a" strokeWidth="1.2" />
      {/* Надпись */}
      <text x={FIELD.x + FIELD.w/2} y={FIELD.y + FIELD.h/2 - 10}
        textAnchor="middle" fill="#24903a88" fontSize="12"
        fontFamily="Oswald" fontWeight="700" letterSpacing="4">ЛУКОЙЛ</text>
      <text x={FIELD.x + FIELD.w/2} y={FIELD.y + FIELD.h/2 + 6}
        textAnchor="middle" fill="#24903a88" fontSize="10"
        fontFamily="Oswald" letterSpacing="4">АРЕНА</text>

      {/* ── TOOLTIP ───────────────────────────────────────────── */}
      {hovS && hovered && (() => {
        const isPress = hovS.tier === 'press';
        return (
          <g style={{ pointerEvents: 'none' }}>
            <rect x={SW/2 - 90} y={SH/2 - 22} width="180" height="44" rx="8"
              fill="rgba(0,0,0,0.92)" stroke={TIER_COLOR[hovS.tier] + '88'} strokeWidth="1" />
            <text x={SW/2} y={SH/2 - 6} textAnchor="middle" dominantBaseline="middle"
              fill={TIER_COLOR[hovS.tier]} fontSize="12"
              fontFamily="Oswald" fontWeight="700">{hovS.label.replace('\n',' ')}</text>
            <text x={SW/2} y={SH/2 + 10} textAnchor="middle" dominantBaseline="middle"
              fill="#aaa" fontSize="9" fontFamily="Oswald">
              {isPress ? 'Не продаётся' : `${TIER_LABEL[hovS.tier]} · ${hovS.price}₽/место`}
            </text>
          </g>
        );
      })()}

      {/* ── АКТИВНЫЙ сектор — подсветка рамки ────────────────── */}
      {active && !hovered && (() => {
        const s = SECTOR_MAP[active];
        if (!s) return null;
        return (
          <text x={SW/2} y={SH/2} textAnchor="middle" dominantBaseline="middle"
            fill={TIER_COLOR[s.tier] + '33'} fontSize="28"
            fontFamily="Oswald" fontWeight="700">{s.label.replace('\n',' ')}</text>
        );
      })()}
    </svg>
  );
}

// ─── Главный компонент ───────────────────────────────────────────
const Booking = () => {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedSeat[]>([]);
  const [step, setStep] = useState<'map' | 'seats' | 'checkout' | 'done'>('map');

  const sInfo = activeSector ? SECTOR_MAP[activeSector] : null;
  const occ = activeSector ? OCC[activeSector] : new Set<string>();

  const toggleSeat = (row: number, seat: number) => {
    if (!activeSector) return;
    const key = `${activeSector}-${row}-${seat}`;
    if (occ.has(`${row}-${seat}`)) return;
    setSelected(prev =>
      prev.find(s => s.key === key)
        ? prev.filter(s => s.key !== key)
        : [...prev, {
            key, row, seat,
            price: SECTOR_MAP[activeSector].price,
            sectorId: activeSector,
            sectorLabel: SECTOR_MAP[activeSector].label.replace('\n', ' '),
          }]
    );
  };

  const isSelected = (row: number, seat: number) =>
    selected.some(s => s.key === `${activeSector}-${row}-${seat}`);

  const total = selected.reduce((sum, s) => sum + s.price, 0);

  const handleSectorClick = (id: string) => {
    if (SECTOR_MAP[id]?.tier === 'press') return;
    setActiveSector(id);
    setStep('seats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-spartak-black font-body text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-spartak-black/95 backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-lg">С</div>
            <span className="font-display font-bold text-lg uppercase tracking-wide">Спартак</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {step !== 'map' && (
              <button onClick={() => { setStep('map'); setActiveSector(null); }}
                className="flex items-center gap-2 text-white/60 hover:text-white uppercase tracking-wider transition-colors">
                <Icon name="Map" size={15} />Схема
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white uppercase tracking-wider transition-colors">
              <Icon name="X" size={15} />Закрыть
            </Link>
          </div>
        </div>
      </header>

      {/* MATCH BANNER */}
      <div className="bg-gradient-to-r from-spartak-dark/25 to-transparent border-b border-white/10">
        <div className="container py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-sm">С</div>
            <span className="font-display text-white/30 font-bold">VS</span>
            <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center font-display font-bold text-sm">З</div>
            <div>
              <div className="font-display font-bold uppercase text-sm">Спартак — Зенит</div>
              <div className="text-white/40 text-xs flex items-center gap-3">
                <span className="flex items-center gap-1"><Icon name="Calendar" size={11} />5 июля · 17:30</span>
                <span className="flex items-center gap-1"><Icon name="MapPin" size={11} />Открытие Арена, Москва</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/30">Вместимость: <b className="text-white/70">45 496</b></span>
            <span className="bg-spartak px-2.5 py-1 text-white font-semibold uppercase tracking-wider text-[10px]">Топ-матч</span>
          </div>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="border-b border-white/5 bg-white/[0.015]">
        <div className="container py-2 flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider">
          <button onClick={() => { setStep('map'); setActiveSector(null); }}
            className={step === 'map' ? 'text-spartak' : 'hover:text-white/60 transition-colors'}>
            1. Сектор
          </button>
          <Icon name="ChevronRight" size={10} />
          <span className={step === 'seats' ? 'text-spartak' : ''}>2. Место</span>
          <Icon name="ChevronRight" size={10} />
          <span className={step === 'checkout' ? 'text-spartak' : ''}>3. Оплата</span>
        </div>
      </div>

      <div className="container py-6 grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* LEFT */}
        <div>

          {/* ── СХЕМА СТАДИОНА ───────────────────────────────── */}
          {step === 'map' && (
            <div className="animate-fade-in">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h2 className="font-display font-bold uppercase text-3xl">Схема стадиона</h2>
                  <p className="text-white/40 text-sm mt-1">Нажми на сектор для выбора мест</p>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="min-w-[520px]">
                  <StadiumMap
                    active={activeSector}
                    hovered={hoveredSector}
                    onEnter={setHoveredSector}
                    onLeave={() => setHoveredSector(null)}
                    onClick={handleSectorClick}
                  />
                </div>
              </div>

              {/* Легенда */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(TIER_COLOR) as Tier[]).filter(t => t !== 'press').map(tier => (
                  <div key={tier} className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: TIER_COLOR[tier] }} />
                    <span className="text-xs text-white/70">{TIER_LABEL[tier]}</span>
                    <span className="text-xs text-white/35">· {TIER_PRICE_LABEL[tier]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ВЫБОР МЕСТ ───────────────────────────────────── */}
          {step === 'seats' && sInfo && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => { setStep('map'); setActiveSector(null); }}
                  className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors">
                  <Icon name="ArrowLeft" size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
                      style={{ background: TIER_COLOR[sInfo.tier] + '33', color: TIER_COLOR[sInfo.tier], border: `1px solid ${TIER_COLOR[sInfo.tier]}66` }}>
                      {TIER_LABEL[sInfo.tier]}
                    </span>
                    <h2 className="font-display font-bold uppercase text-2xl">Сектор {sInfo.label.replace('\n',' ')}</h2>
                  </div>
                  <div className="text-white/40 text-sm mt-0.5">
                    {sInfo.price}₽ · {sInfo.rows} рядов · {sInfo.seats} мест в ряду
                  </div>
                </div>
              </div>

              {/* Ориентир поля */}
              <div className="flex justify-center mb-3">
                <div className="px-8 py-1.5 border border-green-500/25 bg-green-700/10 text-green-400 text-[10px] font-display uppercase tracking-[0.3em]">
                  ⚽ Поле
                </div>
              </div>

              {/* Кресла */}
              <div className="bg-white/[0.025] border border-white/[0.08] p-4 mb-4 overflow-x-auto">
                <div className="inline-flex flex-col gap-1.5 items-center min-w-full">
                  {Array.from({ length: sInfo.rows }).map((_, row) => (
                    <div key={row} className="flex items-center gap-1.5">
                      <span className="w-5 text-[9px] text-white/20 text-right select-none">{row + 1}</span>
                      <div className="flex gap-[3px]">
                        {Array.from({ length: sInfo.seats }).map((_, seat) => {
                          const isOcc = occ.has(`${row}-${seat}`);
                          const isSel = isSelected(row, seat);
                          return (
                            <button key={seat}
                              onClick={() => toggleSeat(row, seat)}
                              disabled={isOcc}
                              title={isOcc ? 'Занято' : `Ряд ${row + 1}, место ${seat + 1}`}
                              className={`w-[17px] h-[17px] rounded-t-[3px] transition-all ${
                                isOcc ? 'bg-white/10 cursor-not-allowed'
                                : isSel ? 'ring-2 ring-white scale-110 z-10 relative'
                                : 'hover:scale-125 hover:z-10 hover:relative'
                              }`}
                              style={{ background: isOcc ? undefined : isSel ? '#ffffff' : TIER_COLOR[sInfo.tier] }}
                            />
                          );
                        })}
                      </div>
                      <span className="w-5 text-[9px] text-white/20 text-left select-none">{row + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-5 pt-4 border-t border-white/10 text-[11px] text-white/50">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-t-[3px]" style={{ background: TIER_COLOR[sInfo.tier] }} />Свободно
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-t-[3px] bg-white" />Выбрано
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-t-[3px] bg-white/10" />Занято
                  </span>
                </div>
              </div>

              {selected.filter(s => s.sectorId === activeSector).length > 0 && (
                <div className="flex items-center justify-between bg-spartak/10 border border-spartak/25 px-4 py-3">
                  <span className="text-sm">Выбрано: <b>{selected.filter(s => s.sectorId === activeSector).length} мест</b></span>
                  <Button onClick={() => setStep('checkout')}
                    className="h-9 px-5 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none text-sm">
                    Оформить →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── ОФОРМЛЕНИЕ ───────────────────────────────────── */}
          {step === 'checkout' && (
            <div className="animate-fade-in max-w-lg">
              <button onClick={() => setStep('seats')}
                className="flex items-center gap-2 text-white/40 hover:text-white mb-5 transition-colors text-sm uppercase tracking-wider">
                <Icon name="ArrowLeft" size={15} />Назад
              </button>
              <h2 className="font-display font-bold uppercase text-3xl mb-5">Оформление</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Имя" placeholder="Иван" />
                  <Field label="Фамилия" placeholder="Петров" />
                </div>
                <Field label="Email для билетов" placeholder="ivan@mail.ru" type="email" />
                <Field label="Телефон" placeholder="+7 999 000-00-00" type="tel" />
                <div className="pt-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Способ оплаты</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ i: 'CreditCard', l: 'Карта' }, { i: 'Smartphone', l: 'СБП' }, { i: 'Wallet', l: 'Кошелёк' }]
                      .map((p, idx) => (
                        <button key={p.l} className={`p-4 border flex flex-col items-center gap-2 transition-all ${
                          idx === 0 ? 'border-spartak bg-spartak/10' : 'border-white/10 hover:border-white/30'}`}>
                          <Icon name={p.i} size={20} className={idx === 0 ? 'text-spartak' : 'text-white/50'} />
                          <span className="text-xs uppercase tracking-wide">{p.l}</span>
                        </button>
                    ))}
                  </div>
                </div>
                <Button onClick={() => setStep('done')}
                  className="w-full h-13 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider text-base rounded-none mt-2">
                  Оплатить {total.toLocaleString('ru')}₽
                </Button>
                <p className="text-white/25 text-xs flex items-center gap-2">
                  <Icon name="ShieldCheck" size={12} />Безопасная оплата. Билеты придут на email.
                </p>
              </div>
            </div>
          )}

          {/* ── ГОТОВО ───────────────────────────────────────── */}
          {step === 'done' && (
            <div className="animate-scale-in flex flex-col items-center text-center py-16">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-5">
                <Icon name="Check" size={40} />
              </div>
              <h2 className="font-display font-bold uppercase text-4xl mb-3">Оплачено!</h2>
              <p className="text-white/50 max-w-md mb-8">Билеты на матч Спартак — Зенит отправлены на email. Увидимся на трибунах!</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/"><Button className="h-12 px-8 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">На главную</Button></Link>
                <button onClick={() => { setStep('map'); setActiveSector(null); setSelected([]); }}
                  className="h-12 px-8 border border-white/20 hover:border-white/50 text-white font-display uppercase tracking-wider transition-colors">
                  Купить ещё
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── КОРЗИНА ──────────────────────────────────────────── */}
        {step !== 'done' && (
          <div className="bg-white/[0.025] border border-white/[0.08] p-5 lg:sticky lg:top-20">
            <h3 className="font-display font-bold uppercase text-base mb-4 flex items-center gap-2">
              <Icon name="Ticket" size={16} className="text-spartak" />Корзина
            </h3>
            {selected.length === 0 ? (
              <div className="text-center py-8 text-white/25">
                <Icon name="MousePointerClick" size={24} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs">Выбери сектор на схеме, затем место</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4 max-h-72 overflow-y-auto pr-1">
                {selected.map(s => (
                  <div key={s.key} className="flex items-center justify-between bg-white/[0.04] border border-white/[0.06] px-3 py-2">
                    <div>
                      <div className="text-xs font-medium">Сектор {s.sectorLabel}</div>
                      <div className="text-[10px] text-white/35">Ряд {s.row + 1} · Место {s.seat + 1}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-display font-bold text-sm">{s.price.toLocaleString('ru')}₽</span>
                      <button onClick={() => setSelected(p => p.filter(x => x.key !== s.key))}
                        className="text-white/25 hover:text-spartak transition-colors">
                        <Icon name="X" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-white/10 pt-3 mb-4">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-white/40 text-xs">Билетов</span>
                <span className="text-xs">{selected.length} шт.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 uppercase text-xs tracking-wider font-display">Итого</span>
                <span className="font-display font-bold text-2xl">{total.toLocaleString('ru')}₽</span>
              </div>
            </div>
            <Button
              disabled={selected.length === 0}
              onClick={() => step === 'seats' ? setStep('checkout') : undefined}
              className="w-full h-11 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none disabled:opacity-25 text-sm">
              {step === 'checkout' ? 'Заполни форму →' : 'Оформить →'}
            </Button>
            {selected.length > 0 && step !== 'checkout' && (
              <button onClick={() => setSelected([])}
                className="w-full mt-2 text-[11px] text-white/25 hover:text-white/50 transition-colors py-1">
                Очистить выбор
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-wider text-white/35 mb-1.5">{label}</label>
    <input type={type} placeholder={placeholder}
      className="w-full h-11 px-4 bg-white/[0.04] border border-white/10 focus:border-spartak outline-none transition-colors placeholder:text-white/20 text-sm" />
  </div>
);

export default Booking;
