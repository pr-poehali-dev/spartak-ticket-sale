import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

// Секторы Лукойл Арены (Краснодар) — реальная разбивка трибун
// Север (A), Юг (B, гостевой), Запад (C, VIP), Восток (D)
// Угловые секторы: NW, NE, SW, SE
const SECTORS: Record<string, { name: string; price: number; color: string; tier: string; rows: number; seats: number }> = {
  N:   { name: 'Северная трибуна',   price: 1400, color: '#D62027', tier: 'Стандарт', rows: 20, seats: 22 },
  S:   { name: 'Южная (гостевая)',   price: 900,  color: '#888',   tier: 'Эконом',   rows: 15, seats: 18 },
  W:   { name: 'Западная (VIP)',     price: 5500, color: '#9B51E0', tier: 'VIP',      rows: 18, seats: 20 },
  E:   { name: 'Восточная трибуна',  price: 1800, color: '#E8772E', tier: 'Стандарт', rows: 20, seats: 22 },
  NW:  { name: 'Угол Северо-Запад', price: 1200, color: '#E0A030', tier: 'Эконом',   rows: 12, seats: 14 },
  NE:  { name: 'Угол Северо-Восток',price: 1200, color: '#E0A030', tier: 'Эконом',   rows: 12, seats: 14 },
  SW:  { name: 'Угол Юго-Запад',    price: 1100, color: '#888',   tier: 'Эконом',   rows: 10, seats: 12 },
  SE:  { name: 'Угол Юго-Восток',   price: 1100, color: '#888',   tier: 'Эконом',   rows: 10, seats: 12 },
};

// Детерминированно занятые места
function makeOccupied(rows: number, seats: number) {
  const set = new Set<string>();
  for (let r = 0; r < rows; r++)
    for (let s = 0; s < seats; s++)
      if ((r * 5 + s * 7 + r + s) % 9 === 0) set.add(`${r}-${s}`);
  return set;
}

const occupiedMap: Record<string, Set<string>> = {};
Object.entries(SECTORS).forEach(([id, s]) => {
  occupiedMap[id] = makeOccupied(s.rows, s.seats);
});

interface Seat { key: string; row: number; seat: number; price: number; sector: string; sectorId: string }

// SVG-схема Лукойл Арены: подлинные пропорции, 8 трибун
const SCHEME_SIZE = 480;
const CX = SCHEME_SIZE / 2;
const CY = SCHEME_SIZE / 2;
const RX = 148, RY = 110; // внешний эллипс поля
const PITCH_RX = 82, PITCH_RY = 54;

// Цвет сектора на схеме
function schemeColor(id: string, active: string | null, hovered: string | null) {
  if (id === active) return SECTORS[id].color;
  if (id === hovered) return SECTORS[id].color + 'cc';
  return '#1a1a1a';
}

// Сектора: path/polygon SVG
const SectorPaths: { id: string; label: string; labelX: number; labelY: number; d: string }[] = [
  // Северная трибуна — вверх
  {
    id: 'N', label: 'Север', labelX: CX, labelY: 62,
    d: `M${CX - 80},${CY - RY - 8} A${RX + 18},${RY + 50} 0 0 1 ${CX + 80},${CY - RY - 8}
        L${CX + 95},${CY - RY - 62} A${RX + 58},${RY + 95} 0 0 0 ${CX - 95},${CY - RY - 62} Z`,
  },
  // Южная трибуна — вниз
  {
    id: 'S', label: 'Юг', labelX: CX, labelY: SCHEME_SIZE - 58,
    d: `M${CX - 80},${CY + RY + 8} A${RX + 18},${RY + 50} 0 0 0 ${CX + 80},${CY + RY + 8}
        L${CX + 95},${CY + RY + 62} A${RX + 58},${RY + 95} 0 0 1 ${CX - 95},${CY + RY + 62} Z`,
  },
  // Западная трибуна — влево
  {
    id: 'W', label: 'Запад\nVIP', labelX: 58, labelY: CY,
    d: `M${CX - RX - 8},${CY - 68} A${RX + 50},${RY + 18} 0 0 0 ${CX - RX - 8},${CY + 68}
        L${CX - RX - 66},${CY + 82} A${RX + 92},${RY + 58} 0 0 1 ${CX - RX - 66},${CY - 82} Z`,
  },
  // Восточная трибуна — вправо
  {
    id: 'E', label: 'Восток', labelX: SCHEME_SIZE - 58, labelY: CY,
    d: `M${CX + RX + 8},${CY - 68} A${RX + 50},${RY + 18} 0 0 1 ${CX + RX + 8},${CY + 68}
        L${CX + RX + 66},${CY + 82} A${RX + 92},${RY + 58} 0 0 0 ${CX + RX + 66},${CY - 82} Z`,
  },
  // Угол СЗ
  {
    id: 'NW', label: 'СЗ', labelX: 88, labelY: 90,
    d: `M${CX - 95},${CY - RY - 62} A${RX + 58},${RY + 95} 0 0 1 ${CX - RX - 66},${CY - 82}
        L${CX - RX - 92},${CY - 118} A${RX + 112},${RY + 130} 0 0 0 ${CX - 126},${CY - RY - 90} Z`,
  },
  // Угол СВ
  {
    id: 'NE', label: 'СВ', labelX: SCHEME_SIZE - 88, labelY: 90,
    d: `M${CX + 95},${CY - RY - 62} A${RX + 58},${RY + 95} 0 0 0 ${CX + RX + 66},${CY - 82}
        L${CX + RX + 92},${CY - 118} A${RX + 112},${RY + 130} 0 0 1 ${CX + 126},${CY - RY - 90} Z`,
  },
  // Угол ЮЗ
  {
    id: 'SW', label: 'ЮЗ', labelX: 88, labelY: SCHEME_SIZE - 90,
    d: `M${CX - 95},${CY + RY + 62} A${RX + 58},${RY + 95} 0 0 0 ${CX - RX - 66},${CY + 82}
        L${CX - RX - 92},${CY + 118} A${RX + 112},${RY + 130} 0 0 1 ${CX - 126},${CY + RY + 90} Z`,
  },
  // Угол ЮВ
  {
    id: 'SE', label: 'ЮВ', labelX: SCHEME_SIZE - 88, labelY: SCHEME_SIZE - 90,
    d: `M${CX + 95},${CY + RY + 62} A${RX + 58},${RY + 95} 0 0 1 ${CX + RX + 66},${CY + 82}
        L${CX + RX + 92},${CY + 118} A${RX + 112},${RY + 130} 0 0 0 ${CX + 126},${CY + RY + 90} Z`,
  },
];

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
                <div className="relative w-full max-w-[520px]">
                  <svg
                    viewBox={`0 0 ${SCHEME_SIZE} ${SCHEME_SIZE}`}
                    className="w-full drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(0 0 40px rgba(214,32,39,0.15))' }}
                  >
                    {/* Фон */}
                    <rect width={SCHEME_SIZE} height={SCHEME_SIZE} fill="#0e0e0e" rx="12" />

                    {/* Секторы */}
                    {SectorPaths.map((sp) => (
                      <g key={sp.id}>
                        <path
                          d={sp.d}
                          fill={schemeColor(sp.id, activeSector, hoveredSector)}
                          stroke="#2a2a2a"
                          strokeWidth="1.5"
                          className="cursor-pointer transition-all duration-200"
                          onClick={() => handleSectorClick(sp.id)}
                          onMouseEnter={() => setHoveredSector(sp.id)}
                          onMouseLeave={() => setHoveredSector(null)}
                          style={{ opacity: activeSector && activeSector !== sp.id ? 0.4 : 1 }}
                        />
                        {/* Label */}
                        {sp.label.split('\n').map((line, i) => (
                          <text
                            key={i}
                            x={sp.labelX}
                            y={sp.labelY + i * 13}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="pointer-events-none"
                            fill={activeSector === sp.id ? '#fff' : hoveredSector === sp.id ? '#fff' : '#aaa'}
                            fontSize="10"
                            fontFamily="Oswald, sans-serif"
                            fontWeight="600"
                            letterSpacing="1"
                          >
                            {line.toUpperCase()}
                          </text>
                        ))}
                      </g>
                    ))}

                    {/* Поле */}
                    <ellipse cx={CX} cy={CY} rx={PITCH_RX + 12} ry={PITCH_RY + 12} fill="#155a25" />
                    <ellipse cx={CX} cy={CY} rx={PITCH_RX} ry={PITCH_RY} fill="#1a7a30" stroke="#22a040" strokeWidth="1.5" />
                    {/* Разметка */}
                    <ellipse cx={CX} cy={CY} rx={PITCH_RX * 0.35} ry={PITCH_RY * 0.35} fill="none" stroke="#22a040" strokeWidth="1" />
                    <line x1={CX} y1={CY - PITCH_RY} x2={CX} y2={CY + PITCH_RY} stroke="#22a040" strokeWidth="1" />
                    <circle cx={CX} cy={CY} r="3" fill="#22a040" />
                    {/* Ворота */}
                    <rect x={CX - 16} y={CY - PITCH_RY - 5} width="32" height="7" rx="2" fill="none" stroke="#22a040" strokeWidth="1.5" />
                    <rect x={CX - 16} y={CY + PITCH_RY - 2} width="32" height="7" rx="2" fill="none" stroke="#22a040" strokeWidth="1.5" />
                    {/* Штрафная */}
                    <rect x={CX - 34} y={CY - PITCH_RY - 1} width="68" height="24" rx="1" fill="none" stroke="#22a040" strokeWidth="0.8" />
                    <rect x={CX - 34} y={CY + PITCH_RY - 22} width="68" height="24" rx="1" fill="none" stroke="#22a040" strokeWidth="0.8" />

                    {/* Надпись в поле */}
                    <text x={CX} y={CY - 10} textAnchor="middle" fill="#22a040" fontSize="8" fontFamily="Oswald" fontWeight="700" letterSpacing="2">ЛУКОЙЛ</text>
                    <text x={CX} y={CY + 5} textAnchor="middle" fill="#22a040" fontSize="7" fontFamily="Oswald" letterSpacing="2">АРЕНА</text>

                    {/* Цены при наведении */}
                    {hoveredSector && (
                      <g>
                        <rect
                          x={SectorPaths.find(s => s.id === hoveredSector)!.labelX - 38}
                          y={SectorPaths.find(s => s.id === hoveredSector)!.labelY + 14}
                          width="76" height="18" rx="4"
                          fill="rgba(0,0,0,0.8)"
                        />
                        <text
                          x={SectorPaths.find(s => s.id === hoveredSector)!.labelX}
                          y={SectorPaths.find(s => s.id === hoveredSector)!.labelY + 24}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#fff"
                          fontSize="9"
                          fontFamily="Oswald"
                          fontWeight="600"
                        >
                          от {SECTORS[hoveredSector].price}₽
                        </text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'VIP', color: '#9B51E0', price: '5 500₽' },
                  { label: 'Премиум', color: '#E8772E', price: '1 800₽' },
                  { label: 'Стандарт', color: '#D62027', price: '1 400₽' },
                  { label: 'Эконом', color: '#E0A030', price: '900–1 200₽' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-2">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: l.color }} />
                    <div>
                      <div className="text-xs font-semibold">{l.label}</div>
                      <div className="text-xs text-white/40">{l.price}</div>
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
                  <h2 className="font-display font-bold uppercase text-2xl">{sInfo.name}</h2>
                  <div className="flex items-center gap-3 text-sm text-white/50 mt-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: sInfo.color }} />
                      {sInfo.tier}
                    </span>
                    <span>от {sInfo.price}₽ / место</span>
                    <span>{sInfo.rows} рядов · {sInfo.seats} мест в ряду</span>
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
