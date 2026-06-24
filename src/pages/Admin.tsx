import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import func2url from '../../backend/func2url.json';

const SECTORS_URL = func2url['sectors'];
const LOGIN_URL = func2url['admin-login'];
const MATCHES_URL = func2url['matches'];

type Tier = 'platinum' | 'bronze' | 'standard' | 'vip' | 'corner' | 'press';

interface Sector {
  id: string;
  label: string;
  tier: Tier;
  price: number;
  rows: number;
  seats: number;
}

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

const EMPTY_MATCH: Omit<Match, 'id'> = {
  opp: '', date: '', time: '', tour: '', home: true, status: 'В продаже', price: 1500, tag: '',
};

const TIER_LABEL: Record<Tier, string> = {
  platinum: 'Platinum', bronze: 'Bronze', standard: 'Стандарт', vip: 'VIP', corner: 'Угловой', press: 'Пресса',
};

const TIERS: Tier[] = ['platinum', 'bronze', 'standard', 'vip', 'corner', 'press'];

const inputCls = 'bg-white/5 border border-white/10 px-2 py-1.5 outline-none focus:border-spartak text-white text-sm';

const Admin = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'sectors' | 'matches'>('sectors');

  // Sectors
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [savingSectors, setSavingSectors] = useState(false);
  const [sectorsMsg, setSectorsMsg] = useState('');

  // Matches
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchesMsg, setMatchesMsg] = useState('');
  const [editMatch, setEditMatch] = useState<Partial<Match> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [savingMatch, setSavingMatch] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) { setPassword(saved); tryLogin(saved); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tryLogin = async (pw: string) => {
    setLoginError('');
    try {
      const res = await fetch(LOGIN_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
      if (res.ok) {
        sessionStorage.setItem('admin_pw', pw);
        setAuthed(true);
        loadSectors();
        loadMatches();
      } else {
        sessionStorage.removeItem('admin_pw');
        setAuthed(false);
        setLoginError('Неверный пароль');
      }
    } catch { setLoginError('Ошибка соединения'); }
  };

  const loadSectors = async () => {
    setLoadingSectors(true);
    try {
      const res = await fetch(SECTORS_URL);
      const data = await res.json();
      setSectors(data.sectors || []);
    } finally { setLoadingSectors(false); }
  };

  const loadMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await fetch(MATCHES_URL);
      const data = await res.json();
      setMatches(data.matches || []);
    } finally { setLoadingMatches(false); }
  };

  const updateSectorField = (id: string, field: keyof Sector, value: string | number) => {
    setSectors((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const saveSectors = async () => {
    setSavingSectors(true);
    setSectorsMsg('');
    try {
      const res = await fetch(SECTORS_URL, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password }, body: JSON.stringify({ sectors }) });
      setSectorsMsg(res.ok ? 'Изменения сохранены' : 'Ошибка сохранения');
      setTimeout(() => setSectorsMsg(''), 3000);
    } catch { setSectorsMsg('Ошибка соединения'); }
    finally { setSavingSectors(false); }
  };

  const openNew = () => { setEditMatch({ ...EMPTY_MATCH }); setIsNew(true); };
  const openEdit = (m: Match) => { setEditMatch({ ...m }); setIsNew(false); };
  const closeEdit = () => { setEditMatch(null); };

  const saveMatch = async () => {
    if (!editMatch) return;
    setSavingMatch(true);
    setMatchesMsg('');
    try {
      const url = isNew ? MATCHES_URL : `${MATCHES_URL}?id=${editMatch.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editMatch) });
      if (res.ok) { setMatchesMsg('Сохранено'); setTimeout(() => setMatchesMsg(''), 2000); closeEdit(); loadMatches(); }
      else { setMatchesMsg('Ошибка сохранения'); }
    } catch { setMatchesMsg('Ошибка соединения'); }
    finally { setSavingMatch(false); }
  };

  const deleteMatch = async (id: number) => {
    if (!confirm('Удалить матч?')) return;
    await fetch(`${MATCHES_URL}?id=${id}`, { method: 'DELETE' });
    loadMatches();
  };

  const logout = () => { sessionStorage.removeItem('admin_pw'); setAuthed(false); setPassword(''); setSectors([]); setMatches([]); };

  if (!authed) {
    return (
      <div className="min-h-screen bg-spartak-black font-body text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-12 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-2xl">С</div>
          </Link>
          <h1 className="font-display font-bold uppercase text-3xl text-center mb-2">Админ-панель</h1>
          <p className="text-white/50 text-sm text-center mb-8">Управление секторами и матчами</p>
          <form onSubmit={(e) => { e.preventDefault(); tryLogin(password); }} className="space-y-4">
            <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full h-13 px-5 py-3 bg-white/5 border border-white/15 text-white placeholder:text-white/40 outline-none focus:border-spartak" />
            {loginError && <p className="text-spartak text-sm">{loginError}</p>}
            <Button type="submit" className="w-full h-13 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">Войти</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spartak-black font-body text-white">
      <header className="sticky top-0 z-50 bg-spartak-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-xl">С</div>
            <span className="font-display font-bold uppercase tracking-wide">Админ-панель</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/booking">
              <Button variant="outline" className="h-10 border-white/20 bg-transparent hover:bg-white/5 text-white rounded-none text-sm">
                <Icon name="Eye" size={16} className="mr-1" /> Открыть продажи
              </Button>
            </Link>
            <Button onClick={logout} variant="outline" className="h-10 border-white/20 bg-transparent hover:bg-white/5 text-white rounded-none text-sm">Выйти</Button>
          </div>
        </div>
      </header>

      {/* Вкладки */}
      <div className="border-b border-white/10">
        <div className="container flex gap-0">
          {(['sectors', 'matches'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-4 font-display uppercase tracking-wider text-sm transition-all border-b-2 ${tab === t ? 'border-spartak text-white' : 'border-transparent text-white/40 hover:text-white/70'}`}>
              {t === 'sectors' ? 'Секторы' : 'Матчи'}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-8">

        {/* ── СЕКТОРЫ ── */}
        {tab === 'sectors' && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display font-bold uppercase text-3xl">Секторы стадиона</h1>
                <p className="text-white/50 text-sm mt-1">Меняй цену, категорию и количество мест. Не забудь сохранить.</p>
              </div>
              <div className="flex items-center gap-3">
                {sectorsMsg && <span className="text-sm text-green-400">{sectorsMsg}</span>}
                <Button onClick={saveSectors} disabled={savingSectors} className="h-11 px-6 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">
                  {savingSectors ? 'Сохранение…' : 'Сохранить'}
                </Button>
              </div>
            </div>
            {loadingSectors ? (
              <div className="text-center py-20 text-white/50">Загрузка…</div>
            ) : (
              <div className="overflow-x-auto border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 text-white/50 uppercase text-xs tracking-wider">
                      <th className="text-left px-4 py-3">Сектор</th>
                      <th className="text-left px-4 py-3">Название</th>
                      <th className="text-left px-4 py-3">Категория</th>
                      <th className="text-left px-4 py-3">Цена, ₽</th>
                      <th className="text-left px-4 py-3">Рядов</th>
                      <th className="text-left px-4 py-3">Мест в ряду</th>
                      <th className="text-left px-4 py-3">Всего мест</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectors.map((s) => (
                      <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-2 font-display font-bold">{s.id}</td>
                        <td className="px-4 py-2">
                          <input value={s.label} onChange={(e) => updateSectorField(s.id, 'label', e.target.value)} className={`w-28 ${inputCls}`} />
                        </td>
                        <td className="px-4 py-2">
                          <select value={s.tier} onChange={(e) => updateSectorField(s.id, 'tier', e.target.value)} className={inputCls}>
                            {TIERS.map((t) => <option key={t} value={t} className="bg-spartak-black">{TIER_LABEL[t]}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={s.price} onChange={(e) => updateSectorField(s.id, 'price', Number(e.target.value))} className={`w-24 ${inputCls}`} />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={s.rows} onChange={(e) => updateSectorField(s.id, 'rows', Number(e.target.value))} className={`w-16 ${inputCls}`} />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" value={s.seats} onChange={(e) => updateSectorField(s.id, 'seats', Number(e.target.value))} className={`w-16 ${inputCls}`} />
                        </td>
                        <td className="px-4 py-2 text-white/60">{s.rows * s.seats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── МАТЧИ ── */}
        {tab === 'matches' && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display font-bold uppercase text-3xl">Матчи</h1>
                <p className="text-white/50 text-sm mt-1">Добавляй, редактируй и удаляй матчи расписания.</p>
              </div>
              <div className="flex items-center gap-3">
                {matchesMsg && <span className="text-sm text-green-400">{matchesMsg}</span>}
                <Button onClick={openNew} className="h-11 px-6 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">
                  <Icon name="Plus" size={16} className="mr-1" /> Добавить матч
                </Button>
              </div>
            </div>

            {/* Форма добавления / редактирования */}
            {editMatch && (
              <div className="mb-8 border border-white/20 bg-white/[0.03] p-6">
                <h2 className="font-display font-bold uppercase text-lg mb-4">{isNew ? 'Новый матч' : 'Редактирование матча'}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Соперник</label>
                    <input value={editMatch.opp || ''} onChange={(e) => setEditMatch((m) => ({ ...m!, opp: e.target.value }))} className={`w-full ${inputCls}`} placeholder="ЦСКА" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Дата</label>
                    <input value={editMatch.date || ''} onChange={(e) => setEditMatch((m) => ({ ...m!, date: e.target.value }))} className={`w-full ${inputCls}`} placeholder="28 июня" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Время</label>
                    <input value={editMatch.time || ''} onChange={(e) => setEditMatch((m) => ({ ...m!, time: e.target.value }))} className={`w-full ${inputCls}`} placeholder="19:00" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Тур</label>
                    <input value={editMatch.tour || ''} onChange={(e) => setEditMatch((m) => ({ ...m!, tour: e.target.value }))} className={`w-full ${inputCls}`} placeholder="Тур 1" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Цена от, ₽</label>
                    <input type="number" value={editMatch.price || 0} onChange={(e) => setEditMatch((m) => ({ ...m!, price: Number(e.target.value) }))} className={`w-full ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Статус</label>
                    <select value={editMatch.status || 'В продаже'} onChange={(e) => setEditMatch((m) => ({ ...m!, status: e.target.value }))} className={`w-full ${inputCls}`}>
                      <option className="bg-spartak-black">В продаже</option>
                      <option className="bg-spartak-black">Скоро</option>
                      <option className="bg-spartak-black">Продано</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Тег</label>
                    <input value={editMatch.tag || ''} onChange={(e) => setEditMatch((m) => ({ ...m!, tag: e.target.value }))} className={`w-full ${inputCls}`} placeholder="Дерби" />
                  </div>
                  <div>
                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Место</label>
                    <select value={editMatch.home ? 'home' : 'away'} onChange={(e) => setEditMatch((m) => ({ ...m!, home: e.target.value === 'home' }))} className={`w-full ${inputCls}`}>
                      <option value="home" className="bg-spartak-black">Дома</option>
                      <option value="away" className="bg-spartak-black">В гостях</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={saveMatch} disabled={savingMatch} className="h-10 px-6 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">
                    {savingMatch ? 'Сохранение…' : 'Сохранить'}
                  </Button>
                  <Button onClick={closeEdit} variant="outline" className="h-10 px-6 border-white/20 bg-transparent hover:bg-white/5 text-white rounded-none">Отмена</Button>
                </div>
              </div>
            )}

            {loadingMatches ? (
              <div className="text-center py-20 text-white/50">Загрузка…</div>
            ) : (
              <div className="overflow-x-auto border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 text-white/50 uppercase text-xs tracking-wider">
                      <th className="text-left px-4 py-3">Тур</th>
                      <th className="text-left px-4 py-3">Соперник</th>
                      <th className="text-left px-4 py-3">Дата</th>
                      <th className="text-left px-4 py-3">Время</th>
                      <th className="text-left px-4 py-3">Место</th>
                      <th className="text-left px-4 py-3">Статус</th>
                      <th className="text-left px-4 py-3">Цена, ₽</th>
                      <th className="text-left px-4 py-3">Тег</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m) => (
                      <tr key={m.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-white/60">{m.tour}</td>
                        <td className="px-4 py-3 font-display font-bold">Спартак vs {m.opp}</td>
                        <td className="px-4 py-3">{m.date}</td>
                        <td className="px-4 py-3">{m.time}</td>
                        <td className="px-4 py-3 text-white/60">{m.home ? 'Дома' : 'В гостях'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${m.status === 'В продаже' ? 'text-green-400' : m.status === 'Продано' ? 'text-spartak' : 'text-yellow-400'}`}>{m.status}</span>
                        </td>
                        <td className="px-4 py-3">{m.price} ₽</td>
                        <td className="px-4 py-3 text-white/50">{m.tag}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(m)} className="text-white/50 hover:text-white transition-colors"><Icon name="Pencil" size={15} /></button>
                            <button onClick={() => deleteMatch(m.id)} className="text-white/50 hover:text-spartak transition-colors"><Icon name="Trash2" size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {matches.length === 0 && (
                  <div className="text-center py-12 text-white/30">Матчей пока нет</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
