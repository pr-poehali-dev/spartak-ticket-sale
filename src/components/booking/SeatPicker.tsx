import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SectorDef, SelectedSeat, TIER_COLOR, TIER_LABEL } from './types';

interface SeatPickerProps {
  sInfo: SectorDef;
  occ: Set<string>;
  selected: SelectedSeat[];
  activeSector: string | null;
  toggleSeat: (row: number, seat: number) => void;
  isSelected: (row: number, seat: number) => boolean;
  setStep: (step: 'map' | 'seats' | 'checkout' | 'done') => void;
  setActiveSector: (id: string | null) => void;
}

const SeatPicker = ({
  sInfo, occ, selected, activeSector,
  toggleSeat, isSelected, setStep, setActiveSector,
}: SeatPickerProps) => {
  // Размер кресла зависит от количества мест в ряду
  const seatSize = sInfo.seats <= 20 ? 20 : sInfo.seats <= 30 ? 16 : sInfo.seats <= 40 ? 13 : 10;
  const seatGap = seatSize <= 13 ? 2 : 3;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => { setStep('map'); setActiveSector(null); }}
          className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors flex-shrink-0">
          <Icon name="ArrowLeft" size={16} />
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-wider flex-shrink-0"
              style={{ background: TIER_COLOR[sInfo.tier] + '33', color: TIER_COLOR[sInfo.tier], border: `1px solid ${TIER_COLOR[sInfo.tier]}66` }}>
              {TIER_LABEL[sInfo.tier]}
            </span>
            <h2 className="font-display font-bold uppercase text-xl sm:text-2xl truncate">Сектор {sInfo.label.replace('\n',' ')}</h2>
          </div>
          <div className="text-white/40 text-sm mt-0.5">
            {sInfo.price}₽ · {sInfo.rows} рядов · {sInfo.seats} мест в ряду
          </div>
        </div>
      </div>

      {/* Кресла */}
      <div className="bg-white/[0.025] border border-white/[0.08] p-3 sm:p-4 mb-4 overflow-x-auto">
        <div className="inline-flex flex-col items-center" style={{ gap: seatGap }}>
          {Array.from({ length: sInfo.rows }).map((_, i) => sInfo.rows - 1 - i).map((row) => (
            <div key={row} className="flex items-center" style={{ gap: seatGap }}>
              <span className="text-[9px] text-white/20 text-right select-none" style={{ width: seatSize }}>{row + 1}</span>
              <div className="flex" style={{ gap: seatGap }}>
                {Array.from({ length: sInfo.seats }).map((_, seat) => {
                  const isOcc = occ.has(`${row}-${seat}`);
                  const isSel = isSelected(row, seat);
                  return (
                    <button key={seat}
                      onClick={() => toggleSeat(row, seat)}
                      disabled={isOcc}
                      title={isOcc ? 'Занято' : `Ряд ${row + 1}, место ${seat + 1}`}
                      className={`rounded-t-[3px] transition-all flex-shrink-0 ${
                        isOcc ? 'bg-white/10 cursor-not-allowed'
                        : isSel ? 'ring-2 ring-white scale-110 z-10 relative'
                        : 'hover:scale-125 hover:z-10 hover:relative'
                      }`}
                      style={{
                        width: seatSize, height: seatSize,
                        background: isOcc ? undefined : isSel ? '#ffffff' : TIER_COLOR[sInfo.tier],
                      }}
                    />
                  );
                })}
              </div>
              <span className="text-[9px] text-white/20 text-left select-none" style={{ width: seatSize }}>{row + 1}</span>
            </div>
          ))}
        </div>
        {/* Ориентир поля — снизу, 1-й ряд ближе к полю */}
        <div className="flex justify-center mt-3">
          <div className="px-8 py-1.5 border border-green-500/25 bg-green-700/10 text-green-400 text-[10px] font-display uppercase tracking-[0.3em]">
            ⚽ Поле
          </div>
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
  );
};

export default SeatPicker;