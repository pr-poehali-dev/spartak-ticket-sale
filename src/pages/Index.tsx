import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const HERO_IMG = 'https://cdn.poehali.dev/projects/15cd0231-7a21-487c-b490-aa089d1bfe07/files/59c91a46-d5c6-4d09-8c23-f073749f5889.jpg';

const NAV = ['Главная', 'Матчи', 'Билеты', 'Фан ID', 'Новости', 'Контакты'];

const MATCHES = [
  { id: 1, opp: 'ЦСКА', date: '28 июня', time: '19:00', tour: 'Тур 1', home: true, status: 'В продаже', price: 1500, tag: 'Дерби' },
  { id: 2, opp: 'Зенит', date: '5 июля', time: '17:30', tour: 'Тур 2', home: true, status: 'В продаже', price: 2200, tag: 'Топ-матч' },
  { id: 3, opp: 'Локомотив', date: '12 июля', time: '20:00', tour: 'Тур 3', home: false, status: 'Скоро', price: 1200, tag: '' },
  { id: 4, opp: 'Динамо', date: '19 июля', time: '18:00', tour: 'Тур 4', home: true, status: 'В продаже', price: 1800, tag: 'Дерби' },
  { id: 5, opp: 'Краснодар', date: '26 июля', time: '19:30', tour: 'Тур 5', home: false, status: 'Скоро', price: 1300, tag: '' },
  { id: 6, opp: 'Ростов', date: '2 авг', time: '16:00', tour: 'Тур 6', home: true, status: 'В продаже', price: 1100, tag: '' },
];

const FILTERS = ['Все', 'Дома', 'В продаже', 'Дерби'];

const STANDINGS = [
  { pos: 1, team: 'Зенит', games: 30, pts: 68 },
  { pos: 2, team: 'Спартак', games: 30, pts: 64, hl: true },
  { pos: 3, team: 'Краснодар', games: 30, pts: 61 },
  { pos: 4, team: 'ЦСКА', games: 30, pts: 58 },
  { pos: 5, team: 'Динамо', games: 30, pts: 55 },
];

const TIERS = [
  { name: 'Фан-сектор', price: 1100, icon: 'Flame', desc: 'Самый громкий сектор стадиона' },
  { name: 'Центральная трибуна', price: 2500, icon: 'Star', desc: 'Лучший обзор поля' },
  { name: 'VIP-ложа', price: 7000, icon: 'Crown', desc: 'Премиум-сервис и кейтеринг' },
];

const Index = () => {
  const [filter, setFilter] = useState('Все');

  const filtered = MATCHES.filter((m) => {
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
            <div className="w-10 h-10 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-xl skew-x-[-6deg]">С</div>
            <span className="font-display font-bold text-xl tracking-wide uppercase">Спартак</span>
          </div>
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <a key={n} href="#" className="text-sm uppercase tracking-wider text-white/70 hover:text-spartak transition-colors">{n}</a>
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
            <h1 className="font-display font-bold uppercase leading-[0.9] text-6xl md:text-8xl mb-6">
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
      <section className="py-24 relative">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Календарь</span>
              <h2 className="font-display font-bold uppercase text-5xl md:text-6xl mt-2">Ближайшие матчи</h2>
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
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-2xl mx-auto mb-2">С</div>
                    <span className="text-xs uppercase tracking-wide">Спартак</span>
                  </div>
                  <span className="font-display font-bold text-2xl text-white/30">VS</span>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center font-display font-bold text-2xl mx-auto mb-2">{m.opp[0]}</div>
                    <span className="text-xs uppercase tracking-wide">{m.opp}</span>
                  </div>
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

      {/* TIERS */}
      <section className="py-24 bg-gradient-to-b from-transparent via-spartak-dark/10 to-transparent">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Выбери своё место</span>
            <h2 className="font-display font-bold uppercase text-5xl md:text-6xl mt-2">Категории билетов</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((t, i) => (
              <div
                key={t.name}
                className={`relative p-8 border transition-all duration-300 animate-scale-in ${
                  i === 1 ? 'bg-spartak border-spartak scale-105 z-10' : 'bg-white/[0.04] border-white/10 hover:border-spartak/50'
                }`}
                style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
              >
                <Icon name={t.icon} size={40} className={i === 1 ? 'text-white' : 'text-spartak'} />
                <h3 className="font-display font-bold uppercase text-2xl mt-5 mb-2">{t.name}</h3>
                <p className={`text-sm mb-6 ${i === 1 ? 'text-white/80' : 'text-white/50'}`}>{t.desc}</p>
                <div className="font-display font-bold text-4xl mb-6">{t.price}₽</div>
                <Link to="/booking" className="block">
                  <Button className={`w-full h-12 rounded-none font-display uppercase tracking-wider ${
                    i === 1 ? 'bg-white text-spartak hover:bg-white/90' : 'bg-spartak hover:bg-spartak-dark text-white'
                  }`}>
                    Выбрать
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STANDINGS */}
      <section className="py-24">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left" style={{ opacity: 0 }}>
            <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Статистика</span>
            <h2 className="font-display font-bold uppercase text-5xl md:text-6xl mt-2 mb-6">Таблица<br />чемпионата</h2>
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
            <div className="grid grid-cols-[40px_1fr_60px_60px] gap-2 px-6 py-4 text-xs uppercase tracking-wider text-white/40 border-b border-white/10">
              <span>#</span><span>Команда</span><span className="text-center">И</span><span className="text-center">О</span>
            </div>
            {STANDINGS.map((s) => (
              <div
                key={s.pos}
                className={`grid grid-cols-[40px_1fr_60px_60px] gap-2 px-6 py-4 items-center border-b border-white/5 ${s.hl ? 'bg-spartak/15' : ''}`}
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

      {/* FAN ID */}
      <section id="fan-id" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-spartak-dark/20 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Левая часть — текст */}
            <div>
              <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Обязательно для прохода</span>
              <h2 className="font-display font-bold uppercase text-5xl md:text-6xl mt-2 mb-6">Фан ID</h2>
              <p className="text-white/60 mb-8 max-w-md leading-relaxed">
                С сезона 2023 года вход на матчи Российской Премьер-Лиги осуществляется только по Фан ID.
                Это персональная карта болельщика, привязанная к паспорту и билету.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: 'ShieldCheck', title: 'Безопасность', desc: 'Идентификация обеспечивает порядок на трибунах и защиту болельщиков' },
                  { icon: 'Ticket',      title: 'Привязка к билету', desc: 'Фан ID привязывается к каждому купленному билету автоматически' },
                  { icon: 'Clock',       title: 'Оформление за 5 минут', desc: 'Подай заявку на портале Госуслуги — решение приходит за 1–3 дня' },
                  { icon: 'Gift',        title: 'Бонусы и скидки', desc: 'Владельцы Фан ID получают эксклюзивные предложения от клуба' },
                ].map((item) => (
                  <div key={item.icon} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.07] p-4">
                    <div className="w-10 h-10 bg-spartak/20 border border-spartak/30 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} size={20} className="text-spartak" />
                    </div>
                    <div>
                      <div className="font-display font-bold uppercase text-sm tracking-wide">{item.title}</div>
                      <div className="text-white/50 text-sm mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.gosuslugi.ru/fanid" target="_blank" rel="noopener noreferrer">
                  <Button className="h-13 px-8 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">
                    <span className="flex items-center gap-2"><Icon name="ExternalLink" size={18} />Оформить на Госуслугах</span>
                  </Button>
                </a>
                <Button variant="outline" className="h-13 px-8 border-white/20 bg-transparent hover:bg-white/5 text-white font-display uppercase tracking-wider rounded-none">
                  Узнать больше
                </Button>
              </div>
            </div>

            {/* Правая часть — карточка Фан ID */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                {/* Фоновое свечение */}
                <div className="absolute -inset-8 bg-spartak/10 blur-3xl rounded-full" />
                {/* Карта Фан ID */}
                <div className="relative bg-gradient-to-br from-spartak-dark to-spartak border border-spartak/50 rounded-2xl p-7 shadow-2xl">
                  {/* Шапка карты */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center font-display font-bold text-spartak text-lg">С</div>
                      <span className="font-display font-bold uppercase tracking-wider text-sm">Спартак</span>
                    </div>
                    <span className="text-white/60 text-xs uppercase tracking-[0.2em] font-display">Фан ID</span>
                  </div>
                  {/* Аватар */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40">
                      <Icon name="User" size={30} className="text-white/70" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-xl uppercase">Иван Петров</div>
                      <div className="text-white/60 text-sm">Болельщик · с 2019</div>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({length: 5}).map((_,i) => (
                          <div key={i} className="w-4 h-4 bg-white/80 rounded-sm flex items-center justify-center">
                            <Icon name="Star" size={10} className="text-spartak" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Данные */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { l: 'Номер', v: '47 302 819' },
                      { l: 'Матчей', v: '48' },
                      { l: 'Сезон', v: '2026' },
                      { l: 'Сектор', v: 'A3' },
                    ].map((d) => (
                      <div key={d.l} className="bg-white/10 rounded-lg px-3 py-2.5">
                        <div className="text-white/50 text-[10px] uppercase tracking-wider">{d.l}</div>
                        <div className="font-display font-bold text-base">{d.v}</div>
                      </div>
                    ))}
                  </div>
                  {/* Штрихкод */}
                  <div className="bg-white rounded-lg p-3 flex items-center justify-center gap-px">
                    {Array.from({length: 42}).map((_, i) => (
                      <div key={i} className="bg-black rounded-sm"
                        style={{ width: (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1), height: i % 5 === 0 ? 36 : 28 }} />
                    ))}
                  </div>
                  <div className="text-center text-white/40 text-[10px] mt-2 font-mono tracking-widest">4730281947302819</div>
                </div>
                {/* Дополнительная тень снизу */}
                <div className="absolute -bottom-4 left-8 right-8 h-8 bg-spartak/30 blur-xl rounded-full" />
              </div>
            </div>
          </div>

          {/* Шаги оформления */}
          <div className="mt-20 pt-16 border-t border-white/10">
            <h3 className="font-display font-bold uppercase text-3xl text-center mb-10">Как оформить Фан ID</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { n: '01', icon: 'Smartphone', title: 'Зайди на Госуслуги', desc: 'Открой gosuslugi.ru или приложение и найди раздел «Фан ID»' },
                { n: '02', icon: 'FileText',   title: 'Подай заявку',      desc: 'Заполни форму с паспортными данными и загрузи фото' },
                { n: '03', icon: 'Clock',      title: 'Дождись решения',   desc: 'Заявка рассматривается 1–3 рабочих дня' },
                { n: '04', icon: 'Ticket',     title: 'Покупай билеты',    desc: 'После получения Фан ID билеты можно оформлять на нашем сайте' },
              ].map((step) => (
                <div key={step.n} className="relative bg-white/[0.03] border border-white/[0.07] p-6 group hover:border-spartak/40 transition-colors">
                  <div className="absolute -top-4 left-6 font-display font-bold text-4xl text-spartak/20 group-hover:text-spartak/40 transition-colors">{step.n}</div>
                  <Icon name={step.icon} size={28} className="text-spartak mb-4 mt-3" />
                  <div className="font-display font-bold uppercase text-base mb-2">{step.title}</div>
                  <div className="text-white/50 text-sm leading-relaxed">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFY CTA */}
      <section className="py-20">
        <div className="container">
          <div className="relative bg-spartak overflow-hidden p-10 md:p-16 text-center skew-x-[-3deg]">
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
      <footer className="border-t border-white/10 py-12">
        <div className="container grid md:grid-cols-4 gap-8">
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
                  <li key={x}><a href="#" className="text-white/50 hover:text-white text-sm transition-colors">{x}</a></li>
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