import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, Sparkles, X, Check, ShieldCheck, Zap } from 'lucide-react';

export const PWAUpdateNotifier: React.FC = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [changelog, setChangelog] = useState<string>('');
  const [serverVersion, setServerVersion] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register Service Worker and manage lifecycle
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registrado com sucesso:', reg.scope);
          setSwRegistration(reg);

          // Check for worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] Nova versão do Service Worker pronta para ser ativada.');
                  setIsUpdateAvailable(true);
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('[PWA] Falha ao registrar Service Worker:', err);
        });

      // Handle controller change (when new SW takes over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Periodic Version Polling to detect changes on Server automatically
  const checkForVersionUpdate = async () => {
    try {
      const res = await fetch('/api/version', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();

      if (data && data.timestamp) {
        setChangelog(data.changelog || 'Novas atualizações e melhorias publicadas.');
        setServerVersion(data.version || '1.3.0');

        const savedTimestamp = localStorage.getItem('fe_vida_app_version_ts');

        if (!savedTimestamp) {
          // First run, save timestamp
          localStorage.setItem('fe_vida_app_version_ts', String(data.timestamp));
        } else if (Number(savedTimestamp) !== Number(data.timestamp)) {
          console.log('[PWA] Nova versão detectada no servidor!', data);
          setIsUpdateAvailable(true);
        }
      }
    } catch (err) {
      console.warn('[PWA] Erro ao checar versão da API:', err);
    }
  };

  useEffect(() => {
    // Initial check
    checkForVersionUpdate();

    // Check every 45 seconds
    const interval = setInterval(() => {
      checkForVersionUpdate();
      if (swRegistration) {
        swRegistration.update().catch(() => {});
      }
    }, 45000);

    // Check on window focus and network reconnect
    const handleFocus = () => {
      checkForVersionUpdate();
      if (swRegistration) swRegistration.update().catch(() => {});
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleFocus);
    };
  }, [swRegistration]);

  const handleApplyUpdate = async () => {
    setIsUpdating(true);

    try {
      // 1. Tell waiting service worker to skip waiting
      if (swRegistration && swRegistration.waiting) {
        swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // 2. Fetch latest version timestamp and store it
      const res = await fetch('/api/version', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.timestamp) {
          localStorage.setItem('fe_vida_app_version_ts', String(data.timestamp));
        }
      }

      // 3. Clear Cache Storage if available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // 4. Force Reload page bypassing browser cache
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error('[PWA] Erro ao aplicar atualização:', err);
      window.location.reload();
    }
  };

  if (!isUpdateAvailable || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#002147] text-white border-2 border-[#C5A059] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden backdrop-blur-md">
        
        {/* Glow accent effect */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#C5A059]/20 rounded-full blur-xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[#002147] font-extrabold shadow-md border border-[#F1D592] shrink-0 animate-bounce">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="serif font-extrabold text-sm sm:text-base text-[#F1D592] flex items-center gap-1.5">
                <span>Nova Atualização Disponível!</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C5A059] text-[#002147] font-sans font-black">
                  v{serverVersion || '1.3.0'}
                </span>
              </h4>
              <p className="text-[11px] text-gray-300 font-medium">
                Aplicativo baixado em PWA atualizado no servidor
              </p>
            </div>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            title="Lembrar mais tarde"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description / Changelog */}
        <p className="text-xs text-gray-200 leading-relaxed bg-white/10 p-2.5 rounded-xl border border-white/10 font-sans">
          {changelog || 'Novas alterações foram disponibilizadas. Clique abaixo para atualizar instantaneamente sem perder seus dados.'}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleApplyUpdate}
            disabled={isUpdating}
            className="flex-1 py-3 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#002147]" />
                <span>Atualizando App...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 stroke-[2.5]" />
                <span>Atualizar Agora</span>
              </>
            )}
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="px-3.5 py-3 bg-white/10 hover:bg-white/20 text-xs text-gray-300 font-bold rounded-xl transition border border-white/20 shrink-0"
          >
            Mais Tarde
          </button>
        </div>

      </div>
    </div>
  );
};
