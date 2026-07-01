import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

interface Group {
  id: string;
  name: string;
  inviteCode: string;
  memberCount: number;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchGroups = () => {
    setLoading(true);
    setError('');
    api.get('/groups')
      .then((r) => setGroups(r.data))
      .catch(() => setError('Erro ao carregar grupos'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchGroups(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/groups', { name });
      setName('');
      setShowCreate(false);
      fetchGroups();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar grupo');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/groups/join', { inviteCode });
      setInviteCode('');
      setShowJoin(false);
      fetchGroups();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao entrar no grupo');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Grupos</h1>
        <div className="flex gap-2">
          <button onClick={() => { setShowCreate(true); setShowJoin(false); }} className="btn-neon text-sm active:scale-95">
            + Criar Grupo
          </button>
          <button onClick={() => { setShowJoin(true); setShowCreate(false); }} className="btn-neon-blue text-sm active:scale-95">
            Entrar com Código
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-neon-red/10 border border-neon-red/30 text-neon-red p-3 rounded-lg text-sm animate-slide-up">
          {error}
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleCreate} className="card-bet p-5 flex gap-3 animate-slide-up">
          <input className="input-bet flex-1" placeholder="Nome do grupo" value={name} onChange={(e) => setName(e.target.value)} required />
          <button type="submit" className="btn-neon-solid text-sm">Criar</button>
        </form>
      )}

      {showJoin && (
        <form onSubmit={handleJoin} className="card-bet p-5 flex gap-3 animate-slide-up">
          <input className="input-bet flex-1" placeholder="Código de convite" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} required maxLength={8} />
          <button type="submit" className="btn-neon-solid text-sm">Entrar</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Link key={group.id} to={`/groups/${group.id}`} className="card-bet p-5 hover:border-neon-green/30 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center">
                <span className="text-lg">👥</span>
              </div>
              <div>
                <h3 className="font-bold">{group.name}</h3>
                <p className="text-xs text-gray-500">{group.memberCount} membros</p>
              </div>
            </div>
            <div className="bg-bet-700 rounded-lg p-2 text-center">
              <p className="text-[10px] text-gray-500 uppercase">Código</p>
              <p className="font-mono font-bold text-neon-green tracking-widest">{group.inviteCode}</p>
            </div>
          </Link>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-16 card-bet">
          <p className="text-gray-500">Sem grupos ainda</p>
          <p className="text-gray-600 text-sm mt-1">Cria um ou entra com um código</p>
        </div>
      )}
    </div>
  );
}
