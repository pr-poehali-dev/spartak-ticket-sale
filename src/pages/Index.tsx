import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import func2url from '../../backend/func2url.json';

const HERO_IMG = 'https://cdn.poehali.dev/projects/15cd0231-7a21-487c-b490-aa089d1bfe07/bucket/162f91bd-04f0-41f6-9372-14a3e4d28605.jpg';

const NAV = ['Главная', 'Матчи', 'Билеты', 'Фан ID', 'Новости', 'Контакты'];

const MATCHES_URL = func2url['matches'];

const FILTERS = ['Все', 'Дома', 'В продаже', 'Дерби'];

interface Match {
  id: number;
  opp: string;
  date: string;
  time: string;
  tour: string;
  home: boolean;
  status: string;
  price: number;
  tag: string;
}

const STANDINGS = [
  { pos: 1, team: 'Зенит', games: 30, pts: 68 },
  { pos: 2, team: 'Спартак', games: 30, pts: 64, hl: true },
  { pos: 3, team: 'Краснодар', games: 30, pts: 61 },
  { pos: 4, team: 'ЦСКА', games: 30, pts: 58 },
  { pos: 5, team: 'Динамо', games: 30, pts: 55 },
];

const Index = () => {
  const [filter, setFilter] = useState('Все');
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch(MATCHES_URL)
      .then((r) => r.json())
      .then((d) => setMatches(d.matches || []));
  }, []);

  const filtered = matches.filter((m) => {
    if (filter === 'Дома') return m.home;
    if (filter === 'В продаже') return m.status === 'В продаже';
    if (filter === 'Дерби') return m.tag === 'Дерби';
    return true;
  });

  return (
    <div className="min-h-screen bg-spartak-black font-body text-white overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 bg-spartak-black/85 backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-xl skew-x-[-6deg] flex-shrink-0">С</div>
            <span className="font-display font-bold text-sm md:text-xl tracking-wide uppercase hidden xs:block sm:block">Онлайн продажа билетов</span>
            <span className="font-display font-bold text-base tracking-wide uppercase sm:hidden">Спартак</span>
          </div>
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              n === 'Фан ID'
                ? <Link key={n} to="/fan-id" className="text-sm uppercase tracking-wider text-white/70 hover:text-spartak transition-colors">{n}</Link>
                : <a key={n} href="#" className="text-sm uppercase tracking-wider text-white/70 hover:text-spartak transition-colors">{n}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/booking" className="relative hover:text-spartak transition-colors">
              <Icon name="ShoppingCart" size={22} />
            </Link>
            <button className="hover:text-spartak transition-colors"><Icon name="User" size={22} /></button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Стадион Спартак" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-spartak-black via-spartak-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-spartak-black via-transparent to-transparent" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-spartak px-4 py-1.5 rounded-full mb-6 skew-x-[-6deg]">
              <Icon name="Flame" size={16} />
              <span className="text-xs uppercase tracking-widest font-semibold skew-x-[6deg]">Сезон 2026 открыт</span>
            </div>
            <h1 className="font-display font-bold uppercase leading-[0.9] text-5xl md:text-8xl mb-4 md:mb-6">
              Гладиатор<br /><span className="text-spartak">в каждом</span><br />из нас
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-md">
              Покупай билеты на домашние матчи легендарного клуба. Стань частью красно-белой стихии.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking">
                <Button className="bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider text-base h-14 px-8 rounded-none skew-x-[-6deg]">
                  <span className="skew-x-[6deg] flex items-center gap-2"><Icon name="Ticket" size={20} />Купить билеты</span>
                </Button>
              </Link>
              <Button variant="outline" className="border-white/30 bg-transparent hover:bg-white/10 text-white font-display uppercase tracking-wider text-base h-14 px-8 rounded-none">
                Расписание
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <Icon name="ChevronDown" size={28} />
        </div>
      </section>

      {/* MATCHES */}
      <section className="py-12 md:py-24 relative">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Календарь</span>
              <h2 className="font-display font-bold uppercase text-4xl md:text-6xl mt-2">Ближайшие матчи</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 font-display uppercase tracking-wider text-sm transition-all skew-x-[-6deg] ${
                    filter === f ? 'bg-spartak text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span className="block skew-x-[6deg]">{f}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m, i) => (
              <div
                key={m.id}
                className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-spartak transition-all duration-300 p-6 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
              >
                {m.tag && (
                  <span className="absolute top-0 right-0 bg-spartak text-white text-xs font-bold uppercase px-3 py-1 tracking-wider">{m.tag}</span>
                )}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white/40 text-xs uppercase tracking-widest">{m.tour}</span>
                  <span className={`text-xs uppercase font-semibold tracking-wider ${m.status === 'В продаже' ? 'text-green-400' : 'text-yellow-400'}`}>{m.status}</span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="font-display font-bold uppercase text-2xl text-center leading-tight">Спартак</span>
                  <span className="font-display font-bold text-xl text-spartak">VS</span>
                  <span className="font-display font-bold uppercase text-2xl text-center leading-tight">{m.opp}</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-white/60 text-sm mb-6">
                  <span className="flex items-center gap-1"><Icon name="Calendar" size={15} />{m.date}</span>
                  <span className="flex items-center gap-1"><Icon name="Clock" size={15} />{m.time}</span>
                  <span className="flex items-center gap-1"><Icon name={m.home ? 'Home' : 'Plane'} size={15} />{m.home ? 'Дома' : 'Гости'}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-white/40 text-xs">от</span>
                    <span className="font-display font-bold text-2xl ml-1">{m.price}₽</span>
                  </div>
                  <Link to="/booking">
                    <button
                      className="px-5 py-2.5 font-display uppercase text-sm tracking-wider transition-all flex items-center gap-2 bg-spartak hover:bg-spartak-dark text-white"
                    >
                      <Icon name="Ticket" size={16} />Билет
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STANDINGS */}
      <section className="py-12 md:py-24">
        <div className="container grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-slide-in-left" style={{ opacity: 0 }}>
            <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Статистика</span>
            <h2 className="font-display font-bold uppercase text-4xl md:text-6xl mt-2 mb-4 md:mb-6">Таблица<br />чемпионата</h2>
            <p className="text-white/60 mb-8 max-w-md">Следи за положением красно-белых в турнирной таблице Российской Премьер-Лиги.</p>
            <div className="grid grid-cols-3 gap-4">
              {[{ n: '64', l: 'Очков' }, { n: '2', l: 'Место' }, { n: '19', l: 'Побед' }].map((s) => (
                <div key={s.l} className="bg-white/5 border border-white/10 p-5 text-center">
                  <div className="font-display font-bold text-4xl text-spartak">{s.n}</div>
                  <div className="text-xs uppercase tracking-wider text-white/50 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/10">
            <div className="grid grid-cols-[32px_1fr_44px_44px] gap-2 px-4 md:px-6 py-3 text-xs uppercase tracking-wider text-white/40 border-b border-white/10">
              <span>#</span><span>Команда</span><span className="text-center">И</span><span className="text-center">О</span>
            </div>
            {STANDINGS.map((s) => (
              <div
                key={s.pos}
                className={`grid grid-cols-[32px_1fr_44px_44px] gap-2 px-4 md:px-6 py-3 items-center border-b border-white/5 ${s.hl ? 'bg-spartak/15' : ''}`}
              >
                <span className={`font-display font-bold ${s.hl ? 'text-spartak' : ''}`}>{s.pos}</span>
                <span className={`font-medium ${s.hl ? 'text-spartak' : ''}`}>{s.team}</span>
                <span className="text-center text-white/60">{s.games}</span>
                <span className="text-center font-display font-bold">{s.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTIFY CTA */}
      <section className="py-10 md:py-20">
        <div className="container">
          <div className="relative bg-spartak overflow-hidden p-8 md:p-16 text-center skew-x-[-3deg]">
            <div className="skew-x-[3deg]">
              <Icon name="BellRing" size={40} className="mx-auto mb-4" />
              <h2 className="font-display font-bold uppercase text-3xl md:text-5xl mb-3">Не пропусти матч</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">Подпишись на уведомления о новых матчах, скидках и старте продаж билетов.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Твой email"
                  className="flex-1 h-13 px-5 py-3 bg-white text-spartak-black placeholder:text-spartak-black/50 outline-none"
                />
                <Button className="h-13 px-8 bg-spartak-black hover:bg-black text-white font-display uppercase tracking-wider rounded-none">
                  Подписаться
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 md:py-12">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-xl">С</div>
              <span className="font-display font-bold text-xl uppercase">Спартак</span>
            </div>
            <p className="text-white/40 text-sm">Народная команда. Официальный сайт продажи билетов.</p>
          </div>
          {[
            { t: 'Клуб', l: ['Фан ID', 'Стадион', 'Игроки', 'Новости'] },
            { t: 'Билеты', l: ['Расписание', 'Абонементы', 'VIP-ложи', 'Возврат'] },
            { t: 'Контакты', l: ['+7 495 111-11-11', 'tickets@spartak.com', 'Москва, Открытие Арена'] },
          ].map((c) => (
            <div key={c.t}>
              <h4 className="font-display uppercase tracking-wider text-sm mb-4 text-spartak">{c.t}</h4>
              <ul className="space-y-2">
                {c.l.map((x) => (
                  <li key={x}>
                    {x === 'Фан ID'
                      ? <Link to="/fan-id" className="text-white/50 hover:text-white text-sm transition-colors">{x}</Link>
                      : <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">{x}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container mt-10 pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
          <span className="text-white/30 text-xs">© 2026 ФК Спартак Москва</span>
          <div className="flex gap-4">
            {['Send', 'Instagram', 'Youtube'].map((s) => (
              <a key={s} href="#" className="text-white/40 hover:text-spartak transition-colors"><Icon name={s} size={20} /></a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;