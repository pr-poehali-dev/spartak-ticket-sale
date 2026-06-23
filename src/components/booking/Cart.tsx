import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SelectedSeat } from './types';

interface CartProps {
  selected: SelectedSeat[];
  setSelected: React.Dispatch<React.SetStateAction<SelectedSeat[]>>;
  total: number;
  step: 'map' | 'seats' | 'checkout' | 'done';
  setStep: (step: 'map' | 'seats' | 'checkout' | 'done') => void;
}

const Cart = ({ selected, setSelected, total, step, setStep }: CartProps) => {
  return (
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
  );
};

export const Field = ({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-wider text-white/35 mb-1.5">{label}</label>
    <input type={type} placeholder={placeholder}
      className="w-full h-11 px-4 bg-white/[0.04] border border-white/10 focus:border-spartak outline-none transition-colors placeholder:text-white/20 text-sm" />
  </div>
);

export default Cart;
