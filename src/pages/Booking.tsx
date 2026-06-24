import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  SECTORS_URL, SelectedSeat,
  SECTOR_MAP, OCC,
  TIER_COLOR, TIER_LABEL, TIER_PRICE_LABEL, Tier,
  applyDbSectors,
} from '@/components/booking/types';
import StadiumMap from '@/components/booking/StadiumMap';
import SeatPicker from '@/components/booking/SeatPicker';
import Cart, { Field } from '@/components/booking/Cart';

// ─── Главный компонент ───────────────────────────────────────────
const Booking = () => {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedSeat[]>([]);
  const [step, setStep] = useState<'map' | 'seats' | 'checkout' | 'done'>('map');
  const [, setDataVersion] = useState(0);

  useEffect(() => {
    fetch(SECTORS_URL)
      .then((r) => r.json())
      .then((data) => {
        if (data.sectors) {
          applyDbSectors(data.sectors);
          setDataVersion((v) => v + 1);
        }
      })
      .catch(() => {});
  }, []);

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

              <div className="w-full">
                <StadiumMap
                  active={activeSector}
                  hovered={hoveredSector}
                  onEnter={setHoveredSector}
                  onLeave={() => setHoveredSector(null)}
                  onClick={handleSectorClick}
                />
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
            <SeatPicker
              sInfo={sInfo}
              occ={occ}
              selected={selected}
              activeSector={activeSector}
              toggleSeat={toggleSeat}
              isSelected={isSelected}
              setStep={setStep}
              setActiveSector={setActiveSector}
            />
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

                {/* ── ФАН ID ──────────────────────────────────── */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="IdCard" size={16} className="text-spartak" />
                    <p className="text-xs text-white/40 uppercase tracking-wider">Фан ID болельщика</p>
                  </div>
                  <div className="bg-spartak/[0.06] border border-spartak/20 p-4 space-y-3">
                    <p className="text-xs text-white/50 leading-relaxed">
                      Вход на матч возможен только по Фан ID. Укажи номер карты болельщика — он привяжется к билету.
                    </p>
                    <Field label="Номер Фан ID" placeholder="4730 2819 4730" />
                    <a href="/fan-id" className="inline-flex items-center gap-1.5 text-xs text-spartak hover:underline">
                      <Icon name="ExternalLink" size={13} />Нет Фан ID? Узнать, как оформить
                    </a>
                  </div>
                </div>

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
          <Cart
            selected={selected}
            setSelected={setSelected}
            total={total}
            step={step}
            setStep={setStep}
          />
        )}
      </div>
    </div>
  );
};

export default Booking;