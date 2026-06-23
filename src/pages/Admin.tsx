import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import func2url from '../../backend/func2url.json';

const SECTORS_URL = func2url['sectors'];
const LOGIN_URL = func2url['admin-login'];

type Tier = 'platinum' | 'bronze' | 'standard' | 'vip' | 'corner' | 'press';

interface Sector {
  id: string;
  label: string;
  tier: Tier;
  price: number;
  rows: number;
  seats: number;
}

const TIER_LABEL: Record<Tier, string> = {
  platinum: 'Platinum',
  bronze: 'Bronze',
  standard: 'Стандарт',
  vip: 'VIP',
  corner: 'Угловой',
  press: 'Пресса',
};

const TIERS: Tier[] = ['platinum', 'bronze', 'standard', 'vip', 'corner', 'press'];

const Admin = () => {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_pw');
    if (saved) {
      setPassword(saved);
      tryLogin(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tryLogin = async (pw: string) => {
    setLoginError('');
    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        sessionStorage.setItem('admin_pw', pw);
        setAuthed(true);
        loadSectors();
      } else {
        sessionStorage.removeItem('admin_pw');
        setAuthed(false);
        setLoginError('Неверный пароль');
      }
    } catch {
      setLoginError('Ошибка соединения');
    }
  };

  const loadSectors = async () => {
    setLoading(true);
    try {
      const res = await fetch(SECTORS_URL);
      const data = await res.json();
      setSectors(data.sectors || []);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (id: string, field: keyof Sector, value: string | number) => {
    setSectors((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(SECTORS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': password },
        body: JSON.stringify({ sectors }),
      });
      if (res.ok) {
        setMessage('Изменения сохранены');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Ошибка сохранения');
      }
    } catch {
      setMessage('Ошибка соединения');
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('admin_pw');
    setAuthed(false);
    setPassword('');
    setSectors([]);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-spartak-black font-body text-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-3 justify-center mb-8">
            <div className="w-12 h-12 bg-spartak rounded-full flex items-center justify-center font-display font-bold text-2xl">С</div>
          </Link>
          <h1 className="font-display font-bold uppercase text-3xl text-center mb-2">Админ-панель</h1>
          <p className="text-white/50 text-sm text-center mb-8">Управление секторами и ценами</p>
          <form
            onSubmit={(e) => { e.preventDefault(); tryLogin(password); }}
            className="space-y-4"
          >
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-13 px-5 py-3 bg-white/5 border border-white/15 text-white placeholder:text-white/40 outline-none focus:border-spartak"
            />
            {loginError && <p className="text-spartak text-sm">{loginError}</p>}
            <Button type="submit" className="w-full h-13 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">
              Войти
            </Button>
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
            <Button onClick={logout} variant="outline" className="h-10 border-white/20 bg-transparent hover:bg-white/5 text-white rounded-none text-sm">
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-bold uppercase text-3xl">Секторы стадиона</h1>
            <p className="text-white/50 text-sm mt-1">Меняй цену, категорию и количество мест. Не забудь сохранить.</p>
          </div>
          <div className="flex items-center gap-3">
            {message && <span className="text-sm text-green-400">{message}</span>}
            <Button onClick={save} disabled={saving} className="h-11 px-6 bg-spartak hover:bg-spartak-dark text-white font-display uppercase tracking-wider rounded-none">
              {saving ? 'Сохранение…' : 'Сохранить'}
            </Button>
          </div>
        </div>

        {loading ? (
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
                      <input
                        value={s.label}
                        onChange={(e) => updateField(s.id, 'label', e.target.value)}
                        className="w-28 bg-white/5 border border-white/10 px-2 py-1.5 outline-none focus:border-spartak"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={s.tier}
                        onChange={(e) => updateField(s.id, 'tier', e.target.value)}
                        className="bg-white/5 border border-white/10 px-2 py-1.5 outline-none focus:border-spartak"
                      >
                        {TIERS.map((t) => (
                          <option key={t} value={t} className="bg-spartak-black">{TIER_LABEL[t]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={s.price}
                        onChange={(e) => updateField(s.id, 'price', Number(e.target.value))}
                        className="w-24 bg-white/5 border border-white/10 px-2 py-1.5 outline-none focus:border-spartak"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={s.rows}
                        onChange={(e) => updateField(s.id, 'rows', Number(e.target.value))}
                        className="w-16 bg-white/5 border border-white/10 px-2 py-1.5 outline-none focus:border-spartak"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={s.seats}
                        onChange={(e) => updateField(s.id, 'seats', Number(e.target.value))}
                        className="w-16 bg-white/5 border border-white/10 px-2 py-1.5 outline-none focus:border-spartak"
                      />
                    </td>
                    <td className="px-4 py-2 text-white/60">{s.rows * s.seats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
