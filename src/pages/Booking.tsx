import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const SECTORS = [
  { id: 'A', name: 'Фан-сектор', price: 1100, color: '#D62027', tier: 'Эконом' },
  { id: 'B', name: 'Восточная', price: 1800, color: '#E8772E', tier: 'Стандарт' },
  { id: 'C', name: 'Центральная', price: 2500, color: '#F2C94C', tier: 'Премиум' },
  { id: 'D', name: 'Западная', price: 1800, color: '#E8772E', tier: 'Стандарт' },
  { id: 'V', name: 'VIP-ложа', price: 7000, color: '#9B51E0', tier: 'VIP' },
];

const ROWS = 8;
const SEATS_PER_ROW = 14;
// случайно занятые места (детерминированно)
const occupied = new Set<string>();
for (let r = 0; r < ROWS; r++) {
  for (let s = 0; s < SEATS_PER_ROW; s++) {
    if ((r * 7 + s * 3) % 11 === 0) occupied.add(`${r}-${s}`);
  }
}

interface Seat {
  key: string;
  row: number;
  seat: number;
  price: number;
  sector: string;
}

const Booking = () => {
  const [activeSector, setActiveSector] = useState(SECTORS[2]);
  const [selected, setSelected] = useState<Seat[]>([]);
  const [step, setStep] = useState<'seats' | 'checkout' | 'done'>('seats');

  const toggleSeat = (row: number, seat: number) => {
    const key = `${activeSector.id}-${row}-${seat}`;
    if (occupied.has(`${row}-${seat}`)) return;
    setSelected((prev) =>
      prev.find((s) => s.key === key)
        ? prev.filter((s) => s.key !== key)
        : [...prev, { key, row, seat, price: activeSector.price, sector: activeSector.name }]
    );
  };

  const total = selected.reduce((sum, s) => sum + s.price, 0);
  const isSelected = (row: number, seat: number) =>
    selected.some((s) => s.key === `${activeSector.id}-${row}-${seat}`);

  return (
    <div className="min-h-screen bg-spartak-black font-body text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-spartak-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-xl">С</div>
            <span className="font-display font-bold text-xl uppercase tracking-wide">Спартак</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm uppercase tracking-wider transition-colors">
            <Icon name="ArrowLeft" size={18} />Назад
          </Link>
        </div>
      </header>

      {/* MATCH BANNER */}
      <div className="bg-gradient-to-r from-spartak-dark/40 to-transparent border-b border-white/10">
        <div className="container py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-xl">С</div>
            <span className="font-display font-bold text-2xl text-white/40">VS</span>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-display font-bold text-xl">З</div>
            <div className="ml-3">
              <div className="font-display font-bold text-xl uppercase">Спартак — Зенит</div>
              <div className="text-white/50 text-sm flex items-center gap-3">
                <span className="flex items-center gap-1"><Icon name="Calendar" size={14} />5 июля</span>
                <span className="flex items-center gap-1"><Icon name="Clock" size={14} />17:30</span>
                <span className="flex items-center gap-1"><Icon name="MapPin" size={14} />Открытие Арена</span>
              </div>
            </div>
          </div>
          <span className="bg-spartak px-4 py-1.5 text-xs uppercase tracking-widest font-semibold skew-x-[-6deg]">
            <span className="block skew-x-[6deg]">Топ-матч</span>
          </span>
        </div>
      </div>

      <div className="container py-10 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* LEFT: SCHEME OR CHECKOUT */}
        <div>
          {step === 'seats' && (
            <>
              {/* SECTOR SELECT */}
              <div className="mb-8">
                <h2 className="font-display font-bold uppercase text-3xl mb-4">Выбери сектор</h2>
                <div className="flex flex-wrap gap-3">
                  {SECTORS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSector(s)}
                      className={`px-5 py-3 border transition-all text-left ${
                        activeSector.id === s.id ? 'border-spartak bg-white/10' : 'border-white/10 bg-white/[0.03] hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                        <span className="font-display uppercase text-sm tracking-wide">{s.name}</span>
                      </div>
                      <div className="text-white/50 text-xs mt-1">от {s.price}₽ · {s.tier}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* FIELD */}
              <div className="bg-gradient-to-b from-green-900/30 to-spartak-black border border-white/10 p-6 mb-6">
                <div className="bg-green-700/30 border-2 border-green-500/40 rounded-lg py-3 text-center font-display uppercase tracking-[0.4em] text-green-300 text-sm mb-8">
                  Поле
                </div>

                {/* SEATS */}
                <div className="overflow-x-auto">
                  <div className="inline-flex flex-col gap-2 mx-auto min-w-full items-center">
                    {Array.from({ length: ROWS }).map((_, row) => (
                      <div key={row} className="flex items-center gap-2">
                        <span className="w-6 text-xs text-white/30 text-right">{row + 1}</span>
                        <div className="flex gap-1.5">
                          {Array.from({ length: SEATS_PER_ROW }).map((_, seat) => {
                            const occ = occupied.has(`${row}-${seat}`);
                            const sel = isSelected(row, seat);
                            return (
                              <button
                                key={seat}
                                onClick={() => toggleSeat(row, seat)}
                                disabled={occ}
                                title={occ ? 'Занято' : `Ряд ${row + 1}, место ${seat + 1}`}
                                className={`w-6 h-6 rounded-t-md transition-all ${
                                  occ
                                    ? 'bg-white/10 cursor-not-allowed'
                                    : sel
                                    ? 'scale-110 ring-2 ring-white'
                                    : 'hover:scale-110 hover:brightness-125'
                                }`}
                                style={{ background: occ ? undefined : sel ? '#fff' : activeSector.color }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LEGEND */}
                <div className="flex flex-wrap gap-5 justify-center mt-8 pt-6 border-t border-white/10 text-xs">
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-t-md" style={{ background: activeSector.color }} />Свободно</span>
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-t-md bg-white" />Выбрано</span>
                  <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-t-md bg-white/10" />Занято</span>
                </div>
              </div>
            </>
          )}

          {step === 'checkout' && (
            <div className="animate-fade-in">
              <button onClick={() => setStep('seats')} className="flex items-center gap-2 text-white/60 hover:text-white text-sm uppercase tracking-wider mb-6">
                <Icon name="ArrowLeft" size={16} />К выбору мест
              </button>
              <h2 className="font-display font-bold uppercase text-3xl mb-6">Оформление</h2>

              <div className="space-y-5 max-w-lg">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Имя" placeholder="Иван" />
                  <Field label="Фамилия" placeholder="Петров" />
                </div>
                <Field label="Email" placeholder="ivan@mail.ru" type="email" />
                <Field label="Телефон" placeholder="+7 999 000-00-00" type="tel" />

                <div className="pt-4">
                  <h3 className="font-display uppercase tracking-wider text-sm text-spartak mb-3">Способ оплаты</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ i: 'CreditCard', l: 'Карта' }, { i: 'Smartphone', l: 'СБП' }, { i: 'Wallet', l: 'Кошелёк' }].map((p, idx) => (
                      <button key={p.l} className={`p-4 border flex flex-col items-center gap-2 transition-all ${idx === 0 ? 'border-spartak bg-spartak/10' : 'border-white/10 hover:border-white/30'}`}>
                        <Icon name={p.i} size={22} className={idx === 0 ? 'text-spartak' : 'text-white/60'} />
                        <span className="text-xs uppercase tracking-wide">{p.l}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setStep('done')}
                  className="w-full h-14 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider text-base rounded-none mt-4"
                >
                  Оплатить {total}₽
                </Button>
                <p className="text-white/40 text-xs flex items-center gap-2"><Icon name="ShieldCheck" size={14} />Безопасная оплата. Билеты придут на email.</p>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="animate-scale-in flex flex-col items-center text-center py-16">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <Icon name="Check" size={48} />
              </div>
              <h2 className="font-display font-bold uppercase text-4xl mb-3">Оплачено!</h2>
              <p className="text-white/60 max-w-md mb-8">Билеты на матч Спартак — Зенит отправлены на твою почту. Увидимся на трибунах!</p>
              <Link to="/">
                <Button className="h-13 px-8 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">
                  На главную
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT: CART */}
        {step !== 'done' && (
          <div className="bg-white/[0.04] border border-white/10 p-6 lg:sticky lg:top-24">
            <h3 className="font-display font-bold uppercase text-xl mb-4 flex items-center gap-2">
              <Icon name="Ticket" size={20} className="text-spartak" />Корзина
            </h3>
            {selected.length === 0 ? (
              <div className="text-center py-10 text-white/40">
                <Icon name="MousePointerClick" size={32} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Выбери места на схеме</p>
              </div>
            ) : (
              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
                {selected.map((s) => (
                  <div key={s.key} className="flex items-center justify-between bg-white/5 p-3">
                    <div>
                      <div className="text-sm font-medium">{s.sector}</div>
                      <div className="text-xs text-white/50">Ряд {s.row + 1}, место {s.seat + 1}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold">{s.price}₽</span>
                      <button onClick={() => setSelected((p) => p.filter((x) => x.key !== s.key))} className="text-white/40 hover:text-spartak">
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-white/10 pt-4 flex items-center justify-between mb-5">
              <span className="text-white/60 uppercase text-sm tracking-wider">Итого</span>
              <span className="font-display font-bold text-3xl">{total}₽</span>
            </div>

            <Button
              disabled={selected.length === 0 || step === 'checkout'}
              onClick={() => setStep('checkout')}
              className="w-full h-13 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none disabled:opacity-40"
            >
              {step === 'checkout' ? 'Заполни данные →' : 'Оформить'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) => (
  <div>
    <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full h-12 px-4 bg-white/5 border border-white/10 focus:border-spartak outline-none transition-colors placeholder:text-white/30"
    />
  </div>
);

export default Booking;
