import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

interface GroupMember {
  user: {
    id: string;
    name: string;
    balance: number;
    profit: number;
    roi: number;
  };
}

interface GroupData {
  id: string;
  name: string;
  inviteCode: string;
  adminId: string;
  members: GroupMember[];
}

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/groups/${id}`)
        .then((r) => setGroup(r.data))
        .catch((err) => setError(err.response?.data?.error || 'Erro ao carregar grupo'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleCopyCode = async () => {
    if (!group) return;
    try {
      await navigator.clipboard.writeText(group.inviteCode);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = group.inviteCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Eliminar grupo? Esta ação não pode ser desfeita.')) return;
    try {
      await api.delete(`/groups/${id}`);
      navigate('/groups');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao eliminar grupo');
    }
  };

  if (loading) return <div className="text-center py-16"><div className="inline-block w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return <div className="text-center py-16 text-neon-red">{error}</div>;
  if (!group) return <div className="text-center py-16 text-gray-500">Grupo não encontrado</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="card-bet p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black">{group.name}</h1>
          {group.adminId === user?.id && (
            <button onClick={handleDelete} className="btn-danger text-sm">
              Eliminar
            </button>
          )}
        </div>

        <div className="bg-bet-700 rounded-xl p-4 mb-6 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Código de Convite</p>
          <p className="font-mono text-2xl font-black text-neon-green tracking-[0.3em]">{group.inviteCode}</p>
          <button onClick={handleCopyCode} className="btn-neon text-xs mt-3">
            {copied ? '✓ Copiado!' : 'Copiar Código'}
          </button>
        </div>

        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
          Ranking do Grupo ({group.members.length})
        </h2>
        <div className="space-y-2">
          {group.members.map((member, i) => (
            <div key={member.user.id} className={`flex items-center justify-between p-4 rounded-lg ${
              member.user.id === user?.id ? 'bg-neon-green/5 border border-neon-green/20' : 'bg-bet-700'
            }`}>
              <div className="flex items-center gap-4">
                <span className={`text-lg font-black w-8 text-center ${i === 0 ? 'text-neon-yellow' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{member.user.name}</p>
                  {member.user.id === group.adminId && (
                    <span className="text-[9px] bg-neon-blue/10 text-neon-blue px-1.5 py-0.5 rounded">Admin</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-neon-green">{member.user.balance.toFixed(2)} CR</p>
                <p className="text-[10px] text-gray-500">ROI: {member.user.roi}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
