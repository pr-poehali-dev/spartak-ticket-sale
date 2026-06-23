import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

// Реальная нумерация секторов Лукойл Арены:
// Северная: А1–А6 (центр) + углы NW=А7,А8 / NE=А9,А10
// Западная VIP: B1–B5
// Восточная: C1–C6
// Южная гостевая: D1–D3 (центр) + углы SW=D4 / SE=D5
const SECTORS: Record<string, { name: string; price: number; color: string; tier: string; rows: number; seats: number; num: string }> = {
  N_1:  { name: 'Сектор А1', price: 1600, color: '#D62027', tier: 'Стандарт', rows: 18, seats: 20, num: 'А1' },
  N_2:  { name: 'Сектор А2', price: 1600, color: '#D62027', tier: 'Стандарт', rows: 18, seats: 20, num: 'А2' },
  N_3:  { name: 'Сектор А3', price: 1800, color: '#c01020', tier: 'Премиум',  rows: 18, seats: 20, num: 'А3' },
  N_4:  { name: 'Сектор А4', price: 1800, color: '#c01020', tier: 'Премиум',  rows: 18, seats: 20, num: 'А4' },
  N_5:  { name: 'Сектор А5', price: 1600, color: '#D62027', tier: 'Стандарт', rows: 18, seats: 20, num: 'А5' },
  N_6:  { name: 'Сектор А6', price: 1600, color: '#D62027', tier: 'Стандарт', rows: 18, seats: 20, num: 'А6' },
  NW_7: { name: 'Сектор А7', price: 1200, color: '#E0A030', tier: 'Эконом',   rows: 12, seats: 14, num: 'А7' },
  NW_8: { name: 'Сектор А8', price: 1200, color: '#E0A030', tier: 'Эконом',   rows: 12, seats: 14, num: 'А8' },
  NE_9: { name: 'Сектор А9', price: 1200, color: '#E0A030', tier: 'Эконом',   rows: 12, seats: 14, num: 'А9' },
  NE_10:{ name: 'Сектор А10',price: 1200, color: '#E0A030', tier: 'Эконом',   rows: 12, seats: 14, num: 'А10' },
  W_1:  { name: 'Сектор B1', price: 5500, color: '#9B51E0', tier: 'VIP',      rows: 16, seats: 18, num: 'B1' },
  W_2:  { name: 'Сектор B2', price: 7000, color: '#7B2FBE', tier: 'VIP+',     rows: 16, seats: 18, num: 'B2' },
  W_3:  { name: 'Сектор B3', price: 7000, color: '#7B2FBE', tier: 'VIP+',     rows: 16, seats: 18, num: 'B3' },
  W_4:  { name: 'Сектор B4', price: 5500, color: '#9B51E0', tier: 'VIP',      rows: 16, seats: 18, num: 'B4' },
  W_5:  { name: 'Сектор B5', price: 5500, color: '#9B51E0', tier: 'VIP',      rows: 16, seats: 18, num: 'B5' },
  E_1:  { name: 'Сектор C1', price: 1800, color: '#E8772E', tier: 'Стандарт', rows: 18, seats: 20, num: 'C1' },
  E_2:  { name: 'Сектор C2', price: 1800, color: '#E8772E', tier: 'Стандарт', rows: 18, seats: 20, num: 'C2' },
  E_3:  { name: 'Сектор C3', price: 2000, color: '#d0601a', tier: 'Премиум',  rows: 18, seats: 20, num: 'C3' },
  E_4:  { name: 'Сектор C4', price: 2000, color: '#d0601a', tier: 'Премиум',  rows: 18, seats: 20, num: 'C4' },
  E_5:  { name: 'Сектор C5', price: 1800, color: '#E8772E', tier: 'Стандарт', rows: 18, seats: 20, num: 'C5' },
  E_6:  { name: 'Сектор C6', price: 1800, color: '#E8772E', tier: 'Стандарт', rows: 18, seats: 20, num: 'C6' },
  S_1:  { name: 'Сектор D1', price: 900,  color: '#666',   tier: 'Гостевой',  rows: 14, seats: 16, num: 'D1' },
  S_2:  { name: 'Сектор D2', price: 900,  color: '#666',   tier: 'Гостевой',  rows: 14, seats: 16, num: 'D2' },
  S_3:  { name: 'Сектор D3', price: 900,  color: '#666',   tier: 'Гостевой',  rows: 14, seats: 16, num: 'D3' },
  SW_4: { name: 'Сектор D4', price: 1000, color: '#888',   tier: 'Эконом',   rows: 10, seats: 12, num: 'D4' },
  SE_5: { name: 'Сектор D5', price: 1000, color: '#888',   tier: 'Эконом',   rows: 10, seats: 12, num: 'D5' },
};

// Детерминированно занятые места
function makeOccupied(rows: number, seats: number, seed: number) {
  const set = new Set<string>();
  for (let r = 0; r < rows; r++)
    for (let s = 0; s < seats; s++)
      if ((r * 5 + s * 7 + r + s + seed) % 9 === 0) set.add(`${r}-${s}`);
  return set;
}

const occupiedMap: Record<string, Set<string>> = {};
Object.entries(SECTORS).forEach(([id, s], i) => {
  occupiedMap[id] = makeOccupied(s.rows, s.seats, i * 3);
});

interface Seat { key: string; row: number; seat: number; price: number; sector: string; sectorId: string }

// ─── SVG-константы ───────────────────────────────────────────────
const W = 560, H = 560;
const CX = W / 2, CY = H / 2;
// Поле (газон)
const PW = 160, PH = 100; // полуоси газона

// Вспомогательная функция: точка на эллипсе
function ep(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const r = (deg * Math.PI) / 180;
  return { x: cx + rx * Math.cos(r), y: cy + ry * Math.sin(r) };
}

// Строит трапециевидный сегмент трибуны между двумя эллипсами и двумя углами
function tribSegment(
  innerRx: number, innerRy: number,
  outerRx: number, outerRy: number,
  a1: number, a2: number
): string {
  const i1 = ep(CX, CY, innerRx, innerRy, a1);
  const i2 = ep(CX, CY, innerRx, innerRy, a2);
  const o1 = ep(CX, CY, outerRx, outerRy, a1);
  const o2 = ep(CX, CY, outerRx, outerRy, a2);
  const sw1 = a2 > a1 ? 1 : 0;
  const sw2 = a2 > a1 ? 0 : 1;
  return `M${i1.x},${i1.y} A${innerRx},${innerRy} 0 0 ${sw1} ${i2.x},${i2.y}
    L${o2.x},${o2.y} A${outerRx},${outerRy} 0 0 ${sw2} ${o1.x},${o1.y} Z`;
}

// ─── Геометрия трибун ────────────────────────────────────────────
// Зазор (оперативное поле) — внутренний радиус = газон + беговая дорожка
const IR = { x: PW + 28, y: PH + 22 }; // inner radius
const OR = { x: PW + 90, y: PH + 75 }; // outer radius (средняя трибуна)

// Северная А1–А6: углы от 230° до 310° (верх)
// Южная D1–D3: углы от 50° до 130° (низ)
// Западная B1–B5: углы от 140° до 220° (лево)
// Восточная C1–C6: углы от 320° до 40° (право)

// Северная трибуна: 6 секторов — от 215° до 325°
const N_START = 215, N_END = 325;
const N_STEP = (N_END - N_START) / 6;
const northSectors = ['N_1','N_2','N_3','N_4','N_5','N_6'].map((id, i) => ({
  id,
  a1: N_START + i * N_STEP,
  a2: N_START + (i + 1) * N_STEP,
}));

// Западная VIP: 5 секторов — от 125° до 215°
const W_START = 127, W_END = 215;
const W_STEP = (W_END - W_START) / 5;
const westSectors = ['W_1','W_2','W_3','W_4','W_5'].map((id, i) => ({
  id,
  a1: W_START + i * W_STEP,
  a2: W_START + (i + 1) * W_STEP,
}));

// Восточная: 6 секторов — от 325° до 53° (через 0)
const E_ANGLES = [325, 347, 9, 9+22, 9+44, 9+66, 53];
const eastSectors = ['E_1','E_2','E_3','E_4','E_5','E_6'].map((id, i) => ({
  id,
  a1: E_ANGLES[i],
  a2: E_ANGLES[i + 1],
}));

// Южная D1–D3 + углы D4/D5: от 53° до 127°
const S_START = 53, S_END = 127;
// D4 угол ЮЗ: 53→67, D1:67→82, D2:82→98, D3:98→113, D5:113→127
const southSectors = [
  { id: 'SW_4', a1: 53,  a2: 67  },
  { id: 'S_1',  a1: 67,  a2: 82  },
  { id: 'S_2',  a1: 82,  a2: 98  },
  { id: 'S_3',  a1: 98,  a2: 113 },
  { id: 'SE_5', a1: 113, a2: 127 },
];

// Угловые секторы СЗ (А7,А8) и СВ (А9,А10)
const cornerSectors = [
  { id: 'NW_7', a1: 325+15, a2: 345 }, // приблизительно в зоне СЗ
  { id: 'NW_8', a1: 345,    a2: 360+10 },
  { id: 'NE_9', a1: 200,    a2: 215 },
  { id: 'NE_10',a1: 215-15, a2: 200 },
];

// Объединяем все сегменты
const allSegments = [
  ...northSectors,
  ...westSectors,
  ...eastSectors,
  ...southSectors,
].map(({ id, a1, a2 }) => {
  const path = tribSegment(IR.x, IR.y, OR.x, OR.y, a1, a2);
  const midA = (a1 + a2) / 2;
  const lp = ep(CX, CY, (IR.x + OR.x) / 2, (IR.y + OR.y) / 2, midA);
  return { id, path, lx: lp.x, ly: lp.y };
});

const Booking = () => {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [selected, setSelected] = useState<Seat[]>([]);
  const [step, setStep] = useState<'map' | 'seats' | 'checkout' | 'done'>('map');

  const sInfo = activeSector ? SECTORS[activeSector] : null;
  const occ = activeSector ? occupiedMap[activeSector] : new Set<string>();

  const toggleSeat = (row: number, seat: number) => {
    if (!activeSector) return;
    const key = `${activeSector}-${row}-${seat}`;
    if (occ.has(`${row}-${seat}`)) return;
    setSelected((prev) =>
      prev.find((s) => s.key === key)
        ? prev.filter((s) => s.key !== key)
        : [...prev, { key, row, seat, price: SECTORS[activeSector].price, sector: SECTORS[activeSector].name, sectorId: activeSector }]
    );
  };

  const isSelected = (row: number, seat: number) =>
    selected.some((s) => s.key === `${activeSector}-${row}-${seat}`);

  const total = selected.reduce((sum, s) => sum + s.price, 0);

  const handleSectorClick = (id: string) => {
    setActiveSector(id);
    setStep('seats');
  };

  return (
    <div className="min-h-screen bg-spartak-black font-body text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-spartak-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-xl">С</div>
            <span className="font-display font-bold text-xl uppercase tracking-wide">Спартак</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {step !== 'map' && (
              <button
                onClick={() => { setStep('map'); setActiveSector(null); }}
                className="flex items-center gap-2 text-white/60 hover:text-white uppercase tracking-wider transition-colors"
              >
                <Icon name="ArrowLeft" size={16} />Схема
              </button>
            )}
            <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white uppercase tracking-wider transition-colors">
              <Icon name="X" size={16} />Закрыть
            </Link>
          </div>
        </div>
      </header>

      {/* MATCH BANNER */}
      <div className="bg-gradient-to-r from-spartak-dark/30 to-transparent border-b border-white/10">
        <div className="container py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-spartak rounded-full flex items-center justify-center font-display font-bold">С</div>
            <span className="font-display text-white/30 text-xl font-bold">VS</span>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-display font-bold">З</div>
            <div>
              <div className="font-display font-bold uppercase">Спартак — Зенит</div>
              <div className="text-white/50 text-xs flex items-center gap-3">
                <span className="flex items-center gap-1"><Icon name="Calendar" size={12} />5 июля · 17:30</span>
                <span className="flex items-center gap-1"><Icon name="MapPin" size={12} />Лукойл Арена, Краснодар</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span>Вместимость: <b className="text-white">45 496</b></span>
            <span className="bg-spartak px-3 py-1 text-white font-semibold uppercase tracking-wider">Топ-матч</span>
          </div>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="container py-3 flex items-center gap-2 text-xs text-white/40 uppercase tracking-wider">
          <span className={step === 'map' ? 'text-spartak' : ''}>1. Сектор</span>
          <Icon name="ChevronRight" size={12} />
          <span className={step === 'seats' ? 'text-spartak' : ''}>2. Место</span>
          <Icon name="ChevronRight" size={12} />
          <span className={step === 'checkout' ? 'text-spartak' : ''}>3. Оплата</span>
        </div>
      </div>

      <div className="container py-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* LEFT */}
        <div>

          {/* MAP */}
          {step === 'map' && (
            <div className="animate-fade-in">
              <h2 className="font-display font-bold uppercase text-3xl mb-2">Лукойл Арена</h2>
              <p className="text-white/50 text-sm mb-6">Нажми на сектор, чтобы выбрать места</p>

              <div className="flex justify-center">
                <div className="relative w-full max-w-[580px]">
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    className="w-full"
                    style={{ filter: 'drop-shadow(0 0 48px rgba(214,32,39,0.18))' }}
                  >
                    {/* Фон */}
                    <rect width={W} height={H} fill="#0b0b0b" rx="14" />

                    {/* Беговые дорожки / буферная зона вокруг поля */}
                    <ellipse cx={CX} cy={CY} rx={IR.x - 2} ry={IR.y - 2} fill="#111" stroke="#1e1e1e" strokeWidth="1" />

                    {/* Все трибунные сегменты */}
                    {allSegments.map((seg) => {
                      const s = SECTORS[seg.id];
                      if (!s) return null;
                      const isActive = activeSector === seg.id;
                      const isHov = hoveredSector === seg.id;
                      const dimmed = activeSector && !isActive;
                      return (
                        <g key={seg.id}>
                          <path
                            d={seg.path}
                            fill={isActive ? s.color : isHov ? s.color + 'bb' : s.color + '44'}
                            stroke={isActive ? s.color : isHov ? s.color + '99' : '#222'}
                            strokeWidth={isActive ? '2' : '1'}
                            style={{ opacity: dimmed ? 0.35 : 1, cursor: 'pointer', transition: 'all 0.18s' }}
                            onClick={() => handleSectorClick(seg.id)}
                            onMouseEnter={() => setHoveredSector(seg.id)}
                            onMouseLeave={() => setHoveredSector(null)}
                          />
                          {/* Номер сектора */}
                          <text
                            x={seg.lx}
                            y={seg.ly}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isActive ? '#fff' : isHov ? '#fff' : '#999'}
                            fontSize="9.5"
                            fontFamily="Oswald, sans-serif"
                            fontWeight="700"
                            letterSpacing="0.5"
                            style={{ pointerEvents: 'none', transition: 'fill 0.18s' }}
                          >
                            {s.num}
                          </text>
                        </g>
                      );
                    })}

                    {/* Газон */}
                    <ellipse cx={CX} cy={CY} rx={PW + 10} ry={PH + 8} fill="#143d1a" />
                    <ellipse cx={CX} cy={CY} rx={PW} ry={PH} fill="#1a6b2a" stroke="#24903a" strokeWidth="1.5" />
                    {/* Полосы газона */}
                    {[-60,-40,-20,0,20,40,60].map((off) => (
                      <ellipse key={off} cx={CX} cy={CY} rx={Math.abs(off) < 10 ? 2 : PW * 0.5} ry={PH - Math.abs(off) * 0.3}
                        fill="none" stroke="#1e7830" strokeWidth="8"
                        clipPath="url(#pitchClip)"
                        style={{ transform: `translateX(${off}px)`, transformBox: 'fill-box', transformOrigin: 'center' }}
                      />
                    ))}
                    <defs>
                      <clipPath id="pitchClip">
                        <ellipse cx={CX} cy={CY} rx={PW} ry={PH} />
                      </clipPath>
                    </defs>
                    {/* Центральный круг */}
                    <circle cx={CX} cy={CY} r={PH * 0.38} fill="none" stroke="#24903a" strokeWidth="1.5" />
                    <circle cx={CX} cy={CY} r="3.5" fill="#24903a" />
                    {/* Центральная линия */}
                    <line x1={CX - PW} y1={CY} x2={CX + PW} y2={CY} stroke="#24903a" strokeWidth="1.5" />
                    {/* Ворота верх */}
                    <rect x={CX - 22} y={CY - PH - 7} width="44" height="9" rx="2" fill="none" stroke="#24903a" strokeWidth="1.5" />
                    {/* Штрафная верх */}
                    <rect x={CX - 50} y={CY - PH + 1} width="100" height="32" rx="1" fill="none" stroke="#24903a" strokeWidth="1" />
                    {/* Ворота низ */}
                    <rect x={CX - 22} y={CY + PH - 2} width="44" height="9" rx="2" fill="none" stroke="#24903a" strokeWidth="1.5" />
                    {/* Штрафная низ */}
                    <rect x={CX - 50} y={CY + PH - 33} width="100" height="32" rx="1" fill="none" stroke="#24903a" strokeWidth="1" />

                    {/* Надпись в поле */}
                    <text x={CX} y={CY - 12} textAnchor="middle" fill="#24903a" fontSize="9.5" fontFamily="Oswald" fontWeight="700" letterSpacing="3">ЛУКОЙЛ</text>
                    <text x={CX} y={CY + 6}  textAnchor="middle" fill="#24903a" fontSize="8"   fontFamily="Oswald" letterSpacing="3">АРЕНА</text>

                    {/* Подписи трибун снаружи */}
                    <text x={CX}     y="22"      textAnchor="middle" fill="#555" fontSize="9" fontFamily="Oswald" fontWeight="700" letterSpacing="2">СЕВЕР (А)</text>
                    <text x={CX}     y={H - 10}  textAnchor="middle" fill="#555" fontSize="9" fontFamily="Oswald" fontWeight="700" letterSpacing="2">ЮГ (D) · ГОСТИ</text>
                    <text x="14"     y={CY}       textAnchor="middle" fill="#555" fontSize="8" fontFamily="Oswald" fontWeight="700" letterSpacing="1"
                      transform={`rotate(-90, 14, ${CY})`}>ЗАПАД (B) VIP</text>
                    <text x={W - 14} y={CY}       textAnchor="middle" fill="#555" fontSize="8" fontFamily="Oswald" fontWeight="700" letterSpacing="1"
                      transform={`rotate(90, ${W - 14}, ${CY})`}>ВОСТОК (C)</text>

                    {/* Tooltip при наведении */}
                    {hoveredSector && (() => {
                      const seg = allSegments.find(s => s.id === hoveredSector);
                      const si = SECTORS[hoveredSector];
                      if (!seg || !si) return null;
                      const tx = Math.min(Math.max(seg.lx, 55), W - 55);
                      const ty = Math.min(Math.max(seg.ly + 18, 22), H - 22);
                      return (
                        <g style={{ pointerEvents: 'none' }}>
                          <rect x={tx - 52} y={ty - 11} width="104" height="22" rx="5" fill="rgba(0,0,0,0.88)" />
                          <text x={tx} y={ty + 1} textAnchor="middle" dominantBaseline="middle"
                            fill="#fff" fontSize="9" fontFamily="Oswald" fontWeight="600">
                            {si.num} · {si.tier} · {si.price}₽
                          </text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Legend + список секторов */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'VIP+',      color: '#7B2FBE', price: '7 000₽',        nums: 'B2, B3' },
                  { label: 'VIP',       color: '#9B51E0', price: '5 500₽',        nums: 'B1, B4, B5' },
                  { label: 'Премиум',   color: '#c01020', price: '1 800–2 000₽', nums: 'А3, А4, C3, C4' },
                  { label: 'Стандарт',  color: '#D62027', price: '1 600–1 800₽', nums: 'А1–А2,А5–А6, C1–C6' },
                  { label: 'Эконом',    color: '#E0A030', price: '1 000–1 200₽', nums: 'А7–А10, D4, D5' },
                  { label: 'Гостевой',  color: '#666',   price: '900₽',          nums: 'D1, D2, D3' },
                ].map((l) => (
                  <div key={l.label} className="flex items-start gap-2 bg-white/[0.03] border border-white/[0.07] px-3 py-2">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0 mt-0.5" style={{ background: l.color }} />
                    <div>
                      <div className="text-xs font-semibold">{l.label}</div>
                      <div className="text-[10px] text-white/40">{l.price}</div>
                      <div className="text-[9px] text-white/25 mt-0.5">{l.nums}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEATS */}
          {step === 'seats' && activeSector && sInfo && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => { setStep('map'); setActiveSector(null); }}
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                >
                  <Icon name="ArrowLeft" size={18} />
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-3xl text-spartak">{sInfo.num}</span>
                    <h2 className="font-display font-bold uppercase text-xl">{sInfo.name}</h2>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/50 mt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: sInfo.color }} />
                      {sInfo.tier}
                    </span>
                    <span>{sInfo.price}₽ / место</span>
                    <span>{sInfo.rows} рядов · {sInfo.seats} мест</span>
                  </div>
                </div>
              </div>

              {/* Мини-схема ориентации */}
              <div className="flex justify-center mb-2">
                <div className="bg-green-700/20 border border-green-500/20 px-6 py-2 text-center text-xs text-green-400 font-display uppercase tracking-[0.3em]">
                  ⚽ Поле
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 p-5 mb-5">
                <div className="overflow-x-auto">
                  <div className="inline-flex flex-col gap-1.5 items-center min-w-full">
                    {Array.from({ length: sInfo.rows }).map((_, row) => (
                      <div key={row} className="flex items-center gap-1.5">
                        <span className="w-6 text-[10px] text-white/25 text-right select-none">{row + 1}</span>
                        <div className="flex gap-[3px]">
                          {Array.from({ length: sInfo.seats }).map((_, seat) => {
                            const isOcc = occ.has(`${row}-${seat}`);
                            const isSel = isSelected(row, seat);
                            return (
                              <button
                                key={seat}
                                onClick={() => toggleSeat(row, seat)}
                                disabled={isOcc}
                                title={isOcc ? 'Занято' : `Ряд ${row + 1}, место ${seat + 1}`}
                                className={`w-[18px] h-[18px] rounded-t-[4px] transition-all ${
                                  isOcc
                                    ? 'bg-white/10 cursor-not-allowed'
                                    : isSel
                                    ? 'ring-2 ring-white scale-110 z-10 relative'
                                    : 'hover:scale-125 hover:z-10 hover:relative'
                                }`}
                                style={{ background: isOcc ? undefined : isSel ? '#ffffff' : sInfo.color }}
                              />
                            );
                          })}
                        </div>
                        <span className="w-6 text-[10px] text-white/25 text-left select-none">{row + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 justify-center mt-6 pt-4 border-t border-white/10 text-xs text-white/60">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-t-[4px]" style={{ background: sInfo.color }} />Свободно
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-t-[4px] bg-white" />Выбрано
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-t-[4px] bg-white/10" />Занято
                  </span>
                </div>
              </div>

              {selected.filter(s => s.sectorId === activeSector).length > 0 && (
                <div className="flex items-center justify-between bg-spartak/10 border border-spartak/30 px-5 py-3">
                  <span className="text-sm">Выбрано мест: <b>{selected.filter(s => s.sectorId === activeSector).length}</b></span>
                  <Button
                    onClick={() => setStep('checkout')}
                    className="h-9 px-5 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none text-sm"
                  >
                    Оформить →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* CHECKOUT */}
          {step === 'checkout' && (
            <div className="animate-fade-in max-w-lg">
              <button onClick={() => setStep('seats')} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-sm uppercase tracking-wider">
                <Icon name="ArrowLeft" size={16} />Назад к местам
              </button>
              <h2 className="font-display font-bold uppercase text-3xl mb-6">Оформление</h2>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Имя" placeholder="Иван" />
                  <Field label="Фамилия" placeholder="Петров" />
                </div>
                <Field label="Email для билетов" placeholder="ivan@mail.ru" type="email" />
                <Field label="Телефон" placeholder="+7 999 000-00-00" type="tel" />

                <div className="pt-2">
                  <h3 className="font-display uppercase tracking-wider text-sm text-white/50 mb-3">Способ оплаты</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { i: 'CreditCard', l: 'Карта' },
                      { i: 'Smartphone', l: 'СБП' },
                      { i: 'Wallet', l: 'Кошелёк' },
                    ].map((p, idx) => (
                      <button
                        key={p.l}
                        className={`p-4 border flex flex-col items-center gap-2 transition-all ${
                          idx === 0 ? 'border-spartak bg-spartak/10' : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <Icon name={p.i} size={22} className={idx === 0 ? 'text-spartak' : 'text-white/50'} />
                        <span className="text-xs uppercase tracking-wide">{p.l}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setStep('done')}
                  className="w-full h-14 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider text-base rounded-none mt-2"
                >
                  Оплатить {total}₽
                </Button>
                <p className="text-white/30 text-xs flex items-center gap-2">
                  <Icon name="ShieldCheck" size={13} />Безопасная оплата. Билеты придут на email.
                </p>
              </div>
            </div>
          )}

          {/* DONE */}
          {step === 'done' && (
            <div className="animate-scale-in flex flex-col items-center text-center py-16">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <Icon name="Check" size={48} />
              </div>
              <h2 className="font-display font-bold uppercase text-4xl mb-3">Оплачено!</h2>
              <p className="text-white/60 max-w-md mb-8">Билеты на матч Спартак — Зенит отправлены на твою почту. Увидимся в Краснодаре!</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/">
                  <Button className="h-12 px-8 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">
                    На главную
                  </Button>
                </Link>
                <button onClick={() => { setStep('map'); setActiveSector(null); setSelected([]); }} className="h-12 px-8 border border-white/20 hover:border-white/50 text-white font-display uppercase tracking-wider transition-colors">
                  Купить ещё
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: CART */}
        {step !== 'done' && (
          <div className="bg-white/[0.03] border border-white/10 p-5 lg:sticky lg:top-20">
            <h3 className="font-display font-bold uppercase text-lg mb-4 flex items-center gap-2">
              <Icon name="Ticket" size={18} className="text-spartak" />Выбранные билеты
            </h3>

            {selected.length === 0 ? (
              <div className="text-center py-10 text-white/30">
                <Icon name="MousePointerClick" size={28} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Нажми на сектор на схеме, затем выбери место</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4 max-h-80 overflow-y-auto pr-1">
                {selected.map((s) => (
                  <div key={s.key} className="flex items-center justify-between bg-white/[0.04] border border-white/[0.08] px-3 py-2.5">
                    <div>
                      <div className="text-sm font-medium leading-tight">{s.sector}</div>
                      <div className="text-xs text-white/40 mt-0.5">Ряд {s.row + 1} · Место {s.seat + 1}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-display font-bold text-base">{s.price}₽</span>
                      <button
                        onClick={() => setSelected((p) => p.filter((x) => x.key !== s.key))}
                        className="text-white/30 hover:text-spartak transition-colors"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-white/10 pt-4 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white/50 text-sm">Билетов</span>
                <span className="text-sm">{selected.length} шт.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/50 uppercase text-sm tracking-wider font-display">Итого</span>
                <span className="font-display font-bold text-3xl">{total}₽</span>
              </div>
            </div>

            <Button
              disabled={selected.length === 0}
              onClick={() => setStep(step === 'seats' ? 'checkout' : 'checkout')}
              className="w-full h-12 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none disabled:opacity-30"
            >
              {step === 'checkout' ? 'Заполни данные →' : 'Оформить →'}
            </Button>

            {selected.length > 0 && step !== 'checkout' && (
              <button
                onClick={() => setSelected([])}
                className="w-full mt-2 text-xs text-white/30 hover:text-white/60 transition-colors py-1"
              >
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
    <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full h-12 px-4 bg-white/[0.04] border border-white/10 focus:border-spartak outline-none transition-colors placeholder:text-white/20 text-sm"
    />
  </div>
);

export default Booking;