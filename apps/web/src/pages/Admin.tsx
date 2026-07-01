import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  betsCount: number;
  betsWon: number;
  roi: number;
  profit: number;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

interface AdminGroup {
  id: string;
  name: string;
  admin: { id: string; name: string };
  _count: { members: number };
}

interface AdminStats {
  totalUsers: number;
  totalBets: number;
  totalGroups: number;
  pendingBets: number;
  totalWon: number;
  totalLost: number;
}

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [tab, setTab] = useState<'stats' | 'users' | 'groups' | 'sync'>('stats');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', balance: 100 });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    api.get('/admin/stats').then((r) => setStats(r.data));
    api.get('/admin/users').then((r) => setUsers(r.data.users));
    api.get('/admin/groups').then((r) => setGroups(r.data));
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return <div className="text-center py-16 text-neon-red">Acesso negado</div>;
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const r = await api.post('/admin/users', newUser);
      setUsers((prev) => [r.data, ...prev]);
      setNewUser({ name: '', email: '', password: '', balance: 100 });
      setShowCreateUser(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar utilizador');
    }
  };

  const handleBlockUser = async (userId: string, blocked: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}`, { isBlocked: blocked });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isBlocked: blocked } : u));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao bloquear utilizador';
      alert(message);
    }
  };

  const handleSetBalance = async (userId: string, balance: number) => {
    try {
      await api.patch(`/admin/users/${userId}`, { balance });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, balance } : u));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao definir saldo';
      alert(message);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Eliminar utilizador "${name}"?`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao eliminar');
    }
  };

  const handleSyncMatches = async () => {
    const r = await api.post('/matches/sync');
    alert(r.data.message);
  };

  const handleSyncOdds = async () => {
    const r = await api.post('/matches/sync-odds');
    alert(r.data.message);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-black">Painel de Administração</h1>

      <div className="flex gap-2">
        {(['stats', 'users', 'groups', 'sync'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              tab === t ? 'bg-neon-green text-black' : 'bg-bet-700 text-gray-400 hover:text-white'
            }`}
          >
            {t === 'stats' ? 'Estatísticas' : t === 'users' ? 'Utilizadores' : t === 'groups' ? 'Grupos' : 'Sincronizar'}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="stat-card">
            <p className="text-[10px] uppercase text-gray-500">Utilizadores</p>
            <p className="text-3xl font-black text-neon-green">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <p className="text-[10px] uppercase text-gray-500">Apostas</p>
            <p className="text-3xl font-black text-white">{stats.totalBets}</p>
          </div>
          <div className="stat-card">
            <p className="text-[10px] uppercase text-gray-500">Grupos</p>
            <p className="text-3xl font-black text-neon-blue">{stats.totalGroups}</p>
          </div>
          <div className="stat-card">
            <p className="text-[10px] uppercase text-gray-500">Pendentes</p>
            <p className="text-3xl font-black text-neon-yellow">{stats.pendingBets}</p>
          </div>
          <div className="stat-card">
            <p className="text-[10px] uppercase text-gray-500">Ganhos</p>
            <p className="text-3xl font-black text-neon-green">{stats.totalWon}</p>
          </div>
          <div className="stat-card">
            <p className="text-[10px] uppercase text-gray-500">Perdidos</p>
            <p className="text-3xl font-black text-neon-red">{stats.totalLost}</p>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">{users.length} utilizadores</p>
            <button onClick={() => setShowCreateUser(!showCreateUser)} className="btn-neon text-sm">
              + Criar Utilizador
            </button>
          </div>

          {showCreateUser && (
            <form onSubmit={handleCreateUser} className="card-bet p-5 space-y-3 animate-slide-up">
              {error && <p className="text-neon-red text-sm">{error}</p>}
              <div className="grid grid-cols-2 gap-3">
                <input className="input-bet" placeholder="Nome" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                <input className="input-bet" placeholder="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                <input className="input-bet" placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required minLength={6} />
                <input className="input-bet" placeholder="Saldo inicial" type="number" value={newUser.balance} onChange={(e) => setNewUser({ ...newUser, balance: Number(e.target.value) })} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-neon-solid text-sm">Criar</button>
                <button type="button" onClick={() => setShowCreateUser(false)} className="btn-secondary text-sm">Cancelar</button>
              </div>
            </form>
          )}

          <div className="card-bet overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-bet-600/50">
                  <th className="text-left p-3 text-[10px] uppercase text-gray-500">Nome</th>
                  <th className="text-left p-3 text-[10px] uppercase text-gray-500">Email</th>
                  <th className="text-right p-3 text-[10px] uppercase text-gray-500">Saldo</th>
                  <th className="text-right p-3 text-[10px] uppercase text-gray-500">Role</th>
                  <th className="text-right p-3 text-[10px] uppercase text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-bet-700 hover:bg-bet-700/50">
                    <td className="p-3 text-sm">{u.name}</td>
                    <td className="p-3 text-sm text-gray-400">{u.email}</td>
                    <td className="p-3 text-sm text-right font-bold text-neon-green">{u.balance.toFixed(2)}</td>
                    <td className="p-3 text-sm text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${u.role === 'ADMIN' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-bet-600 text-gray-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => { const val = prompt('Novo saldo:', u.balance.toString()); if (val !== null) handleSetBalance(u.id, parseFloat(val)); }} className="text-[10px] text-neon-yellow hover:underline">Saldo</button>
                        <button onClick={() => handleBlockUser(u.id, !u.isBlocked)} className={`text-[10px] ${u.isBlocked ? 'text-neon-green' : 'text-neon-red'} hover:underline`}>{u.isBlocked ? 'Desbloquear' : 'Bloquear'}</button>
                        {u.role !== 'ADMIN' && <button onClick={() => handleDeleteUser(u.id, u.name)} className="text-[10px] text-neon-red hover:underline">Eliminar</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'groups' && (
        <div className="card-bet overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bet-600/50">
                <th className="text-left p-3 text-[10px] uppercase text-gray-500">Nome</th>
                <th className="text-left p-3 text-[10px] uppercase text-gray-500">Admin</th>
                <th className="text-right p-3 text-[10px] uppercase text-gray-500">Membros</th>
                <th className="text-right p-3 text-[10px] uppercase text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.id} className="border-b border-bet-700 hover:bg-bet-700/50">
                  <td className="p-3 text-sm">{g.name}</td>
                  <td className="p-3 text-sm text-gray-400">{g.admin?.name}</td>
                  <td className="p-3 text-sm text-right">{g._count.members}</td>
                  <td className="p-3 text-right">
                    <button onClick={async () => { if (confirm(`Eliminar grupo "${g.name}"?`)) { await api.delete(`/admin/groups/${g.id}`); setGroups((prev) => prev.filter((grp) => grp.id !== g.id)); } }} className="text-[10px] text-neon-red hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'sync' && (
        <div className="card-bet p-6">
          <h3 className="font-bold mb-4">Sincronizar Dados</h3>
          <div className="space-y-3">
            <button onClick={handleSyncMatches} className="btn-neon w-full text-sm">Sincronizar Jogos (Football-Data.org)</button>
            <button onClick={handleSyncOdds} className="btn-neon-blue w-full text-sm">Aplicar Odds Scrapadas (Oddspedia)</button>
            <p className="text-xs text-gray-500 mt-4">Para odds frescas, corre primeiro: <code className="bg-bet-700 px-1 rounded">python apps/api/scraper.py</code></p>
          </div>
        </div>
      )}
    </div>
  );
}
