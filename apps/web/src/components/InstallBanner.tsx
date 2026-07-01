import { useState, useEffect } from 'react';
import { useIOS } from '../hooks/useIOS';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [show, setShow] = useState(false);
  const { isIOS, isStandalone } = useIOS();
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem('install-dismissed-v2');

    if (!isStandalone && !dismissed) {
      setTimeout(() => setShow(true), 4000);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [isStandalone]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShow(false);
      setDeferredPrompt(null);
    }
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('install-dismissed-v2', 'true');
  };

  if (!show || isStandalone) return null;

  // Android/Chrome - direct install
  if (canInstall && !isIOS) {
    return (
      <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up lg:hidden">
        <div className="bg-bet-800 border border-neon-green/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,255,135,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚽</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-white">Instalar BetLeague</p>
              <p className="text-xs text-gray-400">Acesso rápido ao ecrã inicial</p>
            </div>
            <button onClick={dismiss} className="text-gray-500 p-1">✕</button>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleInstall} className="flex-1 bg-neon-green text-black font-bold py-2.5 rounded-xl text-sm active:scale-95">
              Instalar
            </button>
            <button onClick={dismiss} className="px-4 py-2.5 text-gray-400 text-sm bg-bet-700 rounded-xl">
              Agora não
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS - step by step instructions
  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-slide-up lg:hidden">
      <div className="bg-bet-800 border border-neon-green/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,255,135,0.15)]">
        {step === 0 && (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center">
                <span className="text-2xl">⚽</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-white">Instalar BetLeague</p>
                <p className="text-xs text-gray-400">{isIOS ? 'Toca em baixo para ver como' : 'Menu do browser → Instalar app'}</p>
              </div>
              <button onClick={dismiss} className="text-gray-500 p-1">✕</button>
            </div>
            {isIOS ? (
              <button onClick={() => setStep(1)} className="w-full bg-neon-green text-black font-bold py-3 rounded-xl text-sm active:scale-95">
                Como instalar?
              </button>
            ) : (
              <button onClick={dismiss} className="w-full bg-neon-green text-black font-bold py-3 rounded-xl text-sm active:scale-95">
                Entendido
              </button>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm text-white">Passo 1 de 3</p>
              <button onClick={() => setStep(0)} className="text-gray-500 text-xs">Voltar</button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-bet-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Toca no botão <span className="text-neon-blue">Partilhar</span></p>
                <p className="text-xs text-gray-400">Ícone quadrado com seta ↗️</p>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-neon-green text-black font-bold py-3 rounded-xl text-sm active:scale-95">
              Próximo →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm text-white">Passo 2 de 3</p>
              <button onClick={() => setStep(1)} className="text-gray-500 text-xs">Voltar</button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-bet-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Seleciona <span className="text-neon-green">"Adicionar ao Ecrã Inicial"</span></p>
                <p className="text-xs text-gray-400">Rola para baixo se não vires</p>
              </div>
            </div>
            <button onClick={() => setStep(3)} className="w-full bg-neon-green text-black font-bold py-3 rounded-xl text-sm active:scale-95">
              Próximo →
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-sm text-white">Passo 3 de 3</p>
              <button onClick={() => setStep(2)} className="text-gray-500 text-xs">Voltar</button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-neon-green/20 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <div>
                <p className="font-semibold text-white">Toca em <span className="text-neon-green">"Adicionar"</span></p>
                <p className="text-xs text-gray-400">Pronto! App no ecrã inicial</p>
              </div>
            </div>
            <button onClick={dismiss} className="w-full bg-neon-green text-black font-bold py-3 rounded-xl text-sm active:scale-95">
              Entendido! ✨
            </button>
          </>
        )}
      </div>
    </div>
  );
}
