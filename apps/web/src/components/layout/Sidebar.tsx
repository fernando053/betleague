import { NavLink } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/matches', label: 'Ao Vivo', icon: '⚽', live: true },
  { to: '/bets', label: 'Bilhetes', icon: '🎟️' },
  { to: '/groups', label: 'Grupos', icon: '👥' },
  { to: '/rankings', label: 'Ranking', icon: '🏆' },
  { to: '/statistics', label: 'Stats', icon: '📈' },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-bet-800 border-r border-bet-600/50 flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="p-5 border-b border-bet-600/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-green flex items-center justify-center">
            <span className="text-black font-black text-sm">BL</span>
          </div>
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-white">Bet</span>
            <span className="text-neon-green">League</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span className="flex-1">{link.label}</span>
            {link.live && (
              <span className="live-badge">LIVE</span>
            )}
          </NavLink>
        ))}

        {user?.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <span className="text-lg">⚙️</span>
            <span className="flex-1">Admin</span>
          </NavLink>
        )}

        <NavLink
          to="/install"
          className={({ isActive }) =>
            isActive ? 'sidebar-link-active' : 'sidebar-link'
          }
        >
          <span className="text-lg">📲</span>
          <span className="flex-1">Instalar App</span>
        </NavLink>
      </nav>

      <div className="p-3 border-t border-bet-600/50">
        <div className="bg-bet-700 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Saldo</p>
          <p className="text-2xl font-black text-neon-green">{user?.balance?.toFixed(2)}</p>
          <p className="text-[10px] text-gray-500">CRÉDITOS VIRTUAIS</p>
        </div>
      </div>
    </aside>
  );
}
