import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const NAV = ['Главная', 'Матчи', 'Билеты', 'Фан ID', 'Новости', 'Контакты'];

const BENEFITS = [
  { icon: 'ShieldCheck', title: 'Безопасность', desc: 'Идентификация обеспечивает порядок на трибунах и защиту болельщиков от инцидентов.' },
  { icon: 'Ticket',      title: 'Привязка к билету', desc: 'Фан ID автоматически привязывается к каждому купленному билету.' },
  { icon: 'Clock',       title: 'Быстрое оформление', desc: 'Заявка подаётся за 5 минут, решение приходит в течение 1–3 дней.' },
  { icon: 'Gift',        title: 'Бонусы и скидки', desc: 'Владельцы Фан ID получают эксклюзивные предложения от клуба.' },
  { icon: 'Zap',         title: 'Быстрый проход', desc: 'Отдельные ускоренные турникеты для держателей карты болельщика.' },
  { icon: 'RefreshCw',   title: 'Один раз навсегда', desc: 'Фан ID оформляется один раз и действует на всех стадионах РПЛ.' },
];

const STEPS = [
  { n: '01', icon: 'Smartphone', title: 'Зайди на Госуслуги', desc: 'Открой gosuslugi.ru или мобильное приложение и найди раздел «Фан ID».' },
  { n: '02', icon: 'FileText',   title: 'Подай заявку',      desc: 'Заполни форму с паспортными данными и загрузи фотографию.' },
  { n: '03', icon: 'Clock',      title: 'Дождись решения',   desc: 'Заявка рассматривается 1–3 рабочих дня. Уведомление придёт в личный кабинет.' },
  { n: '04', icon: 'Ticket',     title: 'Покупай билеты',    desc: 'После получения Фан ID билеты можно оформлять на нашем сайте.' },
];

const FAQ = [
  { q: 'Что такое Фан ID?', a: 'Фан ID — это персональная карта болельщика, привязанная к паспорту. С её помощью осуществляется вход на матчи Российской Премьер-Лиги. Карта оформляется бесплатно через портал Госуслуги.' },
  { q: 'Нужен ли Фан ID детям?', a: 'Да, Фан ID необходим всем посетителям стадиона, включая детей. На несовершеннолетних карту оформляет родитель или законный представитель через свой аккаунт на Госуслугах.' },
  { q: 'Сколько стоит оформление?', a: 'Оформление Фан ID полностью бесплатное. Карта выдаётся в электронном виде и при желании может быть получена в виде пластиковой карты в МФЦ.' },
  { q: 'Как долго оформляется карта?', a: 'Обычно заявка рассматривается от 1 до 3 рабочих дней. В пиковые периоды срок может увеличиться, поэтому рекомендуем оформлять карту заранее.' },
  { q: 'Можно ли пройти без Фан ID?', a: 'Нет. С 2023 года вход на матчи РПЛ возможен только при наличии действующего Фан ID, привязанного к билету.' },
  { q: 'Что делать, если потерял доступ?', a: 'Доступ к электронному Фан ID восстанавливается через личный кабинет на Госуслугах. Пластиковую карту можно перевыпустить в МФЦ.' },
];

const FanId = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-spartak-black font-body text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-spartak-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-xl skew-x-[-6deg]">С</div>
            <span className="font-display font-bold text-xl tracking-wide uppercase">Спартак</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              n === 'Фан ID'
                ? <Link key={n} to="/fan-id" className="text-sm uppercase tracking-wider text-spartak transition-colors">{n}</Link>
                : <Link key={n} to="/" className="text-sm uppercase tracking-wider text-white/70 hover:text-spartak transition-colors">{n}</Link>
            ))}
          </nav>
          <Link to="/booking" className="relative hover:text-spartak transition-colors">
            <Icon name="ShoppingCart" size={22} />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative py-20 md:py-28 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-spartak-dark/30 via-transparent to-transparent pointer-events-none" />
        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-spartak px-4 py-1.5 rounded-full mb-6 skew-x-[-6deg]">
              <Icon name="IdCard" size={16} />
              <span className="text-xs uppercase tracking-widest font-semibold skew-x-[6deg]">Карта болельщика</span>
            </div>
            <h1 className="font-display font-bold uppercase leading-[0.95] text-5xl md:text-7xl mb-6">
              Фан ID
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-md leading-relaxed">
              С сезона 2023 года вход на матчи Российской Премьер-Лиги осуществляется только по Фан ID — персональной карте болельщика, привязанной к паспорту и билету.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.gosuslugi.ru/fanid" target="_blank" rel="noopener noreferrer">
                <Button className="h-14 px-8 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none skew-x-[-6deg]">
                  <span className="skew-x-[6deg] flex items-center gap-2"><Icon name="ExternalLink" size={18} />Оформить на Госуслугах</span>
                </Button>
              </a>
              <a href="#how">
                <Button variant="outline" className="h-14 px-8 border-white/30 bg-transparent hover:bg-white/10 text-white font-display uppercase tracking-wider rounded-none">
                  Как оформить
                </Button>
              </a>
            </div>
          </div>

          {/* Карта Фан ID */}
          <div className="flex justify-center lg:justify-end animate-scale-in">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-8 bg-spartak/10 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-spartak-dark to-spartak border border-spartak/50 rounded-2xl p-7 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center font-display font-bold text-spartak text-lg">С</div>
                    <span className="font-display font-bold uppercase tracking-wider text-sm">Спартак</span>
                  </div>
                  <span className="text-white/60 text-xs uppercase tracking-[0.2em] font-display">Фан ID</span>
                </div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40">
                    <Icon name="User" size={30} className="text-white/70" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-xl uppercase">Иван Петров</div>
                    <div className="text-white/60 text-sm">Болельщик · с 2019</div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-white/80 rounded-sm flex items-center justify-center">
                          <Icon name="Star" size={10} className="text-spartak" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
                <div className="bg-white rounded-lg p-3 flex items-center justify-center gap-px">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div key={i} className="bg-black rounded-sm"
                      style={{ width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1, height: i % 5 === 0 ? 36 : 28 }} />
                  ))}
                </div>
                <div className="text-center text-white/40 text-[10px] mt-2 font-mono tracking-widest">4730281947302819</div>
              </div>
              <div className="absolute -bottom-4 left-8 right-8 h-8 bg-spartak/30 blur-xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Зачем нужен</span>
            <h2 className="font-display font-bold uppercase text-4xl md:text-5xl mt-2">Преимущества Фан ID</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((item) => (
              <div key={item.icon} className="bg-white/[0.03] border border-white/[0.07] p-6 hover:border-spartak/40 transition-colors">
                <div className="w-12 h-12 bg-spartak/20 border border-spartak/30 flex items-center justify-center mb-5">
                  <Icon name={item.icon} size={24} className="text-spartak" />
                </div>
                <div className="font-display font-bold uppercase text-lg mb-2">{item.title}</div>
                <div className="text-white/50 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="py-20 bg-gradient-to-b from-transparent via-spartak-dark/10 to-transparent">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Видеоинструкция</span>
            <h2 className="font-display font-bold uppercase text-4xl md:text-5xl mt-2">Как оформить Фан ID</h2>
          </div>
          <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl"
            style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/L_icDHSFYdw?rel=0&modestbranding=1"
              title="Как оформить Фан ID"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="how" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Пошагово</span>
            <h2 className="font-display font-bold uppercase text-4xl md:text-5xl mt-2">Шаги оформления</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.n} className="relative bg-white/[0.03] border border-white/[0.07] p-6 group hover:border-spartak/40 transition-colors">
                <div className="absolute -top-4 left-6 font-display font-bold text-4xl text-spartak/20 group-hover:text-spartak/40 transition-colors">{step.n}</div>
                <Icon name={step.icon} size={28} className="text-spartak mb-4 mt-3" />
                <div className="font-display font-bold uppercase text-base mb-2">{step.title}</div>
                <div className="text-white/50 text-sm leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-to-b from-transparent via-spartak-dark/10 to-transparent">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-spartak font-display uppercase tracking-[0.3em] text-sm">Вопросы и ответы</span>
            <h2 className="font-display font-bold uppercase text-4xl md:text-5xl mt-2">Частые вопросы</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.08]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-display font-bold uppercase text-base">{item.q}</span>
                  <Icon name={openFaq === i ? 'Minus' : 'Plus'} size={20} className="text-spartak flex-shrink-0" />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed animate-fade-in">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="relative bg-spartak overflow-hidden p-10 md:p-16 text-center skew-x-[-3deg]">
            <div className="skew-x-[3deg]">
              <Icon name="IdCard" size={40} className="mx-auto mb-4" />
              <h2 className="font-display font-bold uppercase text-3xl md:text-5xl mb-3">Оформи Фан ID сейчас</h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">Это бесплатно и займёт всего 5 минут. После получения карты ты сможешь покупать билеты на любые матчи.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="https://www.gosuslugi.ru/fanid" target="_blank" rel="noopener noreferrer">
                  <Button className="h-13 px-8 bg-spartak-black hover:bg-black text-white font-display uppercase tracking-wider rounded-none">
                    Перейти на Госуслуги
                  </Button>
                </a>
                <Link to="/booking">
                  <Button className="h-13 px-8 bg-white text-spartak hover:bg-white/90 font-display uppercase tracking-wider rounded-none">
                    Купить билеты
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="container flex flex-wrap justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-spartak rounded-full flex items-center justify-center font-display font-bold">С</div>
            <span className="font-display font-bold uppercase">Спартак</span>
          </Link>
          <span className="text-white/30 text-xs">© 2026 ФК Спартак Москва</span>
        </div>
      </footer>
    </div>
  );
};

export default FanId;
