import {
  SECTOR_MAP, TIER_COLOR, TIER_LABEL, sColor,
  SW, SH, FIELD, INNER,
  StadiumMapProps,
} from './types';

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
      {s.label.split('\n').map((line, i) => {
        const fs = (i === 0 ? fontSize * 1.8 : fontSize * 1.2);
        return (
          <text key={i} x={x + w / 2} y={y + h / 2 + (i - (s.label.includes('\n') ? 0.5 : 0)) * (fs + 1)}
            textAnchor="middle" dominantBaseline="middle"
            fill={textFill} fontSize={fs}
            fontFamily="Oswald, sans-serif" fontWeight="700"
            style={{ pointerEvents: 'none', transition: 'fill 0.15s' }}
          >
            {line}
          </text>
        );
      })}
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
      {[['D119',114,382],['D120',114,338],['D121',114,294],
        ['D122',114,250],['D123',114,206],['D124',114,162],['D125',114,118]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={40} h={40} {...props} fontSize={6.5} />
      ))}
      {/* Верхний ярус D224–D233 */}
      {[['D224',62,416],['D225',62,380],['D226',62,344],['D227',62,308],
        ['D228',62,272],['D229',62,236],['D230',62,200],
        ['D231',62,164],['D232',62,128],['D233',62,92]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={40} h={36} {...props} fontSize={6} />
      ))}
      {/* Подпись */}
      <text x={76} y={SH/2} textAnchor="middle" fill="#444" fontSize="8"
        fontFamily="Oswald" fontWeight="700" letterSpacing="2"
        transform={`rotate(-90,76,${SH/2})`}>ЮЖНАЯ ТРИБУНА D</text>

      {/* ── СЕВЕРНАЯ ТРИБУНА B (справа) ─────────────────────── */}
      {/* Нижний ярус B101–B107 */}
      {[['B101',606,118],['B102',606,162],['B103',606,206],
        ['B104',606,250],['B105',606,294],['B106',606,338],['B107',606,382]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={40} h={40} {...props} fontSize={6.5} />
      ))}
      {/* Верхний ярус B201–B210 */}
      {[['B201',650,92],['B202',650,128],['B203',650,164],['B204',650,200],
        ['B205',650,236],['B206',650,272],['B207',650,308],
        ['B208',650,344],['B209',650,380],['B210',650,416]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={40} h={36} {...props} fontSize={6} />
      ))}
      {/* Подпись */}
      <text x={SW - 76} y={SH/2} textAnchor="middle" fill="#444" fontSize="8"
        fontFamily="Oswald" fontWeight="700" letterSpacing="2"
        transform={`rotate(90,${SW-76},${SH/2})`}>СЕВЕРНАЯ ТРИБУНА B</text>

      {/* ── ВОСТОЧНАЯ ТРИБУНА C (снизу) ─────────────────────── */}
      {/* Нижний ярус C109–C115 */}
      {[['C115',252,596],['C114',304,596],['C113',356,596],
        ['C112',408,596],['C111',460,596]
      ].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={48} h={38} {...props} fontSize={6.5} />
      ))}
      {/* C116 — сдвинут к углу D (слева, под D119) */}
      <SectorRect id="C116" x={114} y={540} w={48} h={44} {...props} fontSize={6.5} />
      {[['C110',158,638],['C109',210,638]].map(([id, x, y]) => (
        <SectorRect key={id as string} id={id as string} x={x as number} y={y as number} w={48} h={36} {...props} fontSize={6.5} />
      ))}
      {/* Верхний ярус C211–C220 */}
      {[['C220',174,638],
        ['C219',220,638],['C218',266,638],['C217',312,638],['C216',358,638],
        ['C215',404,638],['C214',450,638],['C213',496,638],['C212',542,638],['C211',588,638]
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

export default StadiumMap;