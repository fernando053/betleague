import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import api from '../lib/api';

interface Bet {
  id: string;
  stake: number;
  totalOdds: number;
  potentialReturn: number;
  status: string;
  createdAt: string;
  selections: Array<{ id: string; matchId: string; market: string; selection: string; odds: number; match: { homeTeam: string; awayTeam: string } }>;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-bet-700 rounded-xl animate-pulse ${className || ''}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
      <Skeleton className="h-40 rounded-2xl" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-5 w-32 mb-3" />
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-5 w-36 mb-3" />
      <Skeleton className="h-16 rounded-xl" />
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [recentBets, setRecentBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bets?status=PENDING').then((r) => { const items = Array.isArray(r.data) ? r.data : r.data.items || []; setActiveBets(items.slice(0, 5)); }).catch(() => {}),
      api.get('/matches/live').then((r) => setLiveMatches(r.data.slice(0, 5))).catch(() => {}),
      api.get('/bets').then((r) => setRecentBets(r.data.slice(0, 3))).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const winRate = user?.betsCount ? Math.round(((user?.betsWon || 0) / user.betsCount) * 100) : 0;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">Olá, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-xs text-gray-500 mt-0.5">Bem-vindo ao betNANDO</p>
        </div>
        <Link to="/matches" className="bg-neon-green text-black font-bold px-4 py-2 rounded-xl text-sm active:scale-95 transition-transform">
          Apostar →
        </Link>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neon-green/20 via-neon-blue/10 to-bet-800 border border-neon-green/20 p-5">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-green/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Saldo Disponível</p>
          <p className="text-4xl font-black text-white mt-1">{user?.balance?.toFixed(2)}</p>
          <p className="text-xs text-neon-green font-semibold mt-0.5">CRÉDITOS VIRTUAIS</p>

          <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex-1">
              <p className="text-[10px] text-gray-400">Lucro</p>
              <p className={`text-sm font-bold ${(user?.profit || 0) >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                {(user?.profit || 0) >= 0 ? '+' : ''}{user?.profit?.toFixed(2)}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-gray-400">ROI</p>
              <p className="text-sm font-bold text-neon-blue">{user?.roi || 0}%</p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-gray-400">Win Rate</p>
              <p className="text-sm font-bold text-neon-yellow">{winRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bet-800 rounded-xl p-4 border border-bet-600/30 text-center">
          <div className="text-2xl mb-1">🎟️</div>
          <p className="text-xl font-black text-white">{user?.betsCount || 0}</p>
          <p className="text-[10px] text-gray-500 uppercase">Apostas</p>
        </div>
        <div className="bg-bet-800 rounded-xl p-4 border border-bet-600/30 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <p className="text-xl font-black text-neon-green">{user?.betsWon || 0}</p>
          <p className="text-[10px] text-gray-500 uppercase">Vitórias</p>
        </div>
        <div className="bg-bet-800 rounded-xl p-4 border border-bet-600/30 text-center">
          <div className="text-2xl mb-1">📊</div>
          <p className="text-xl font-black text-neon-red">{(user?.betsCount || 0) - (user?.betsWon || 0)}</p>
          <p className="text-[10px] text-gray-500 uppercase">Derrotas</p>
        </div>
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-red rounded-full animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Em Jogo</h2>
            </div>
            <Link to="/matches" className="text-xs text-neon-green">Ver todos</Link>
          </div>
          <div className="space-y-2">
            {liveMatches.map((match) => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="block bg-bet-800 rounded-xl p-3 border border-bet-600/30 hover:border-neon-green/30 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-right">
                    <p className="text-sm font-semibold truncate">{match.homeTeam}</p>
                  </div>
                  <div className="px-4 text-center">
                    <span className="bg-neon-red/20 text-neon-red text-[9px] font-bold px-2 py-0.5 rounded-full">AO VIVO</span>
                    <p className="font-black text-lg mt-1">{match.homeScore ?? 0} - {match.awayScore ?? 0}</p>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold truncate">{match.awayTeam}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Active Bets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Apostas Ativas</h2>
          <Link to="/bets" className="text-xs text-neon-green">Ver todas</Link>
        </div>
        {activeBets.length === 0 ? (
          <div className="bg-bet-800 rounded-xl p-8 border border-bet-600/30 text-center">
            <span className="text-3xl block mb-2">🎟️</span>
            <p className="text-gray-500 text-sm">Sem apostas ativas</p>
            <Link to="/matches" className="text-neon-green text-xs mt-2 inline-block hover:underline">Fazer primeira aposta</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activeBets.map((bet) => (
              <Link
                key={bet.id}
                to="/bets"
                className="block bg-bet-800 rounded-xl p-3 border border-bet-600/30 hover:border-neon-yellow/30 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-neon-yellow/10 text-neon-yellow text-[9px] font-bold px-2 py-0.5 rounded-full border border-neon-yellow/30">
                    PENDENTE
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {bet.selections.length} seleção(ões)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Valor: <span className="text-white font-semibold">{bet.stake} CR</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Retorno</p>
                    <p className="text-sm font-bold text-neon-green">{bet.potentialReturn.toFixed(2)} CR</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bets */}
      {recentBets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Últimas Apostas</h2>
            <Link to="/bets" className="text-xs text-neon-green">Ver histórico</Link>
          </div>
          <div className="space-y-2">
            {recentBets.map((bet) => (
              <div
                key={bet.id}
                className="bg-bet-800 rounded-xl p-3 border border-bet-600/30"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    bet.status === 'WON' ? 'bg-neon-green/10 text-neon-green' :
                    bet.status === 'LOST' ? 'bg-neon-red/10 text-neon-red' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {bet.status === 'WON' ? 'GANHOU' : bet.status === 'LOST' ? 'PERDEU' : bet.status === 'PENDING' ? 'PENDENTE' : 'CANCELADO'}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(bet.createdAt).toLocaleDateString('pt-PT')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{bet.stake} CR → <span className={bet.status === 'WON' ? 'text-neon-green' : 'text-white'}>{bet.potentialReturn.toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <Link to="/groups" className="bg-bet-800 rounded-xl p-4 border border-bet-600/30 text-center hover:border-neon-blue/30 transition-all active:scale-[0.98]">
          <span className="text-2xl block mb-1">👥</span>
          <p className="text-xs font-semibold">Grupos</p>
        </Link>
        <Link to="/statistics" className="bg-bet-800 rounded-xl p-4 border border-bet-600/30 text-center hover:border-neon-purple/30 transition-all active:scale-[0.98]">
          <span className="text-2xl block mb-1">📈</span>
          <p className="text-xs font-semibold">Estatísticas</p>
        </Link>
      </div>
    </div>
  );
}
