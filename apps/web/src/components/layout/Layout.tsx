import { NavLink, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import InstallBanner from '../InstallBanner';
import { useState, useEffect } from 'react';
import { useIOS } from '../../hooks/useIOS';

export default function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const { isIOS, isSafari, hasNotch } = useIOS();
  const location = useLocation();

  useEffect(() => {
    let rafId: number;
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(check);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Hide bottom nav on match detail and bet detail pages
  const hideBottomNav = location.pathname.includes('/matches/') || location.pathname.includes('/groups/');

  return (
    <div className={`flex h-screen bg-bet-900 ${isIOS ? 'ios-device' : ''}`}>
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      <div className={`flex-1 flex flex-col ${!isMobile ? 'ml-64' : ''}`}>
        <Navbar isMobile={isMobile} />
        <main
          className={`flex-1 overflow-y-auto ${
            isMobile
              ? `p-4 ${hideBottomNav ? 'pb-4' : 'pb-28'}`
              : 'p-6'
          }`}
          style={{
            paddingTop: isMobile ? 'env(safe-area-inset-top)' : undefined,
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && !hideBottomNav && (
        <>
          <InstallBanner />
          <nav
            className="fixed bottom-0 left-0 right-0 bg-bet-800/95 backdrop-blur-xl border-t border-bet-600/50 z-50"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom)',
              paddingTop: '8px',
            }}
          >
            <div className="flex justify-around items-center px-2">
              {[
                { to: '/', icon: '🏠', label: 'Início' },
                { to: '/matches', icon: '⚽', label: 'Jogos' },
                { to: '/bets', icon: '🎟️', label: 'Apostas' },
                { to: '/groups', icon: '👥', label: 'Grupos' },
                { to: '/rankings', icon: '🏆', label: 'Ranking' },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px] ${
                      isActive
                        ? 'text-neon-green bg-neon-green/10'
                        : 'text-gray-500 active:text-white active:bg-bet-700'
                    }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="text-[9px] font-semibold">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
