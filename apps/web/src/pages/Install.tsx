import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useIOS } from '../hooks/useIOS';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const { user } = useAuth();
  const { isIOS, isStandalone } = useIOS();
  const [canInstall, setCanInstall] = useState(false);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstall(false);
      }
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-bet-900 flex flex-col items-center justify-center p-6" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-sm w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shadow-[0_0_40px_rgba(0,255,135,0.3)] mb-6">
            <span className="text-5xl">⚽</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-white">Bet</span>
            <span className="text-neon-green">League</span>
          </h1>
          <p className="text-gray-500 mt-2">Apostas entre amigos</p>
        </div>

        {/* Install Status */}
        {isStandalone ? (
          <div className="card-bet-glow p-6 text-center">
            <span className="text-4xl mb-4 block">✅</span>
            <h2 className="text-xl font-bold text-neon-green mb-2">Já instalado!</h2>
            <p className="text-gray-400 text-sm">A app está no teu ecrã inicial.</p>
          </div>
        ) : isIOS ? (
          <div className="card-bet p-6 space-y-4">
            <h2 className="text-lg font-bold text-center">Instalar no iPhone</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-blue font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Toca no botão <span className="text-neon-blue">Partilhar</span></p>
                  <p className="text-xs text-gray-500">O ícone quadrado com seta para cima</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-blue font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Seleciona <span className="text-neon-green">"Adicionar ao Ecrã Inicial"</span></p>
                  <p className="text-xs text-gray-500">Rola para baixo se não vires</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-blue font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Toca em <span className="text-neon-green">"Adicionar"</span></p>
                  <p className="text-xs text-gray-500">A app aparece no teu ecrã inicial!</p>
                </div>
              </div>
            </div>

            <div className="bg-bet-700 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Porquê instalar?</p>
                  <p className="text-xs text-gray-400">Acesso rápido, sem barra de URL, experiência nativa</p>
                </div>
              </div>
            </div>
          </div>
        ) : canInstall ? (
          <div className="card-bet p-6 text-center space-y-4">
            <span className="text-4xl block">📲</span>
            <h2 className="text-lg font-bold">Instalar App</h2>
            <p className="text-gray-400 text-sm">Adiciona ao ecrã inicial para acesso rápido</p>
            <button onClick={handleInstall} className="btn-neon-solid w-full">
              Instalar betNANDO
            </button>
          </div>
        ) : (
          <div className="card-bet p-6 text-center space-y-4">
            <span className="text-4xl block">🌐</span>
            <h2 className="text-lg font-bold">Instalar App</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-blue font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Chrome / Edge</p>
                  <p className="text-xs text-gray-500">Menu ⋮ → "Instalar app" ou "Adicionar ao ecrã inicial"</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-blue font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Safari (iOS)</p>
                  <p className="text-xs text-gray-500">Botão Partilhar → "Adicionar ao Ecrã Inicial"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bet-800 rounded-xl p-4 text-center border border-bet-600/30">
            <span className="text-2xl block mb-2">⚡</span>
            <p className="text-xs font-semibold">Rápido</p>
          </div>
          <div className="bg-bet-800 rounded-xl p-4 text-center border border-bet-600/30">
            <span className="text-2xl block mb-2">📱</span>
            <p className="text-xs font-semibold">Nativo</p>
          </div>
          <div className="bg-bet-800 rounded-xl p-4 text-center border border-bet-600/30">
            <span className="text-2xl block mb-2">🔔</span>
            <p className="text-xs font-semibold">Notificações</p>
          </div>
          <div className="bg-bet-800 rounded-xl p-4 text-center border border-bet-600/30">
            <span className="text-2xl block mb-2">📴</span>
            <p className="text-xs font-semibold">Offline</p>
          </div>
        </div>

        {/* Back to app */}
        {user && (
          <Link to="/" className="btn-neon w-full text-center block text-sm">
            Voltar à App
          </Link>
        )}
      </div>
    </div>
  );
}
