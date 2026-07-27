import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { LandingCheckoutModal } from './components/LandingCheckoutModal';
import { MasterDashboard } from './components/MasterDashboard';
import { HomeView } from './views/HomeView';
import { LiturgyView } from './views/LiturgyView';
import { BibleView } from './views/BibleView';
import { PrayersView } from './views/PrayersView';
import { KidsView } from './views/KidsView';
import { RemindersView } from './views/RemindersView';
import { UserAccount } from './types';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('hoje');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('fe_e_vida_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMasterDashOpen, setIsMasterDashOpen] = useState(false);

  // PWA Prompt event handler
  const [pwaDeferredPrompt, setPwaDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setPwaDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = () => {
    if (pwaDeferredPrompt) {
      pwaDeferredPrompt.prompt();
      pwaDeferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('PWA instalado pelo usuário');
        }
        setPwaDeferredPrompt(null);
      });
    } else {
      alert('Para instalar o aplicativo no seu celular:\n\n1. No iPhone (Safari): Toque em "Compartilhar" > "Adicionar à Tela de Início".\n2. No Android (Chrome): Toque nos 3 pontinhos > "Instalar aplicativo".');
    }
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('fe_e_vida_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fe_e_vida_user');
  };

  // Is content unlocked? User is admin OR user paymentStatus is approved
  const isUnlocked = currentUser?.role === 'admin' || currentUser?.paymentStatus === 'approved';

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-[#002147] flex flex-col font-sans selection:bg-[#C5A059]/30 selection:text-[#002147] relative overflow-x-hidden">
      <div className="texture-overlay"></div>
      
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenMasterDashboard={() => setIsMasterDashOpen(true)}
        onLogout={handleLogout}
        isPwaInstallable={!!pwaDeferredPrompt}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 pb-24">
        
        {/* Payment Gate Banner if user is pending authorization */}
        {!isUnlocked && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#002147] text-white border-2 border-[#C5A059] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <h4 className="serif font-bold text-sm sm:text-base text-[#F1D592]">
                  Acesso Restrito ao Conteúdo Premium (R$ 19,00)
                </h4>
                <p className="text-xs text-gray-300">
                  {currentUser?.paymentStatus === 'pending'
                    ? `Aguardando autorização do Administrador Master para o e-mail: ${currentUser.email}`
                    : 'Acesse todo o acervo da Liturgia CNBB, Bíblia, Terço e Área Kids por R$ 19,00.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl gold-gradient text-[#002147] font-extrabold text-xs hover:opacity-95 transition shadow-lg shrink-0 flex items-center justify-center space-x-1.5 uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentUser?.paymentStatus === 'pending' ? 'Ver Status do Pagamento' : 'Assinar Acesso (R$ 19)'}</span>
            </button>
          </div>
        )}

        {/* Dynamic View rendering with smooth motion transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'hoje' && (
              <HomeView
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                isUnlocked={isUnlocked}
              />
            )}

            {activeTab === 'liturgia' && <LiturgyView />}

            {activeTab === 'biblia' && <BibleView />}

            {activeTab === 'oracoes' && <PrayersView />}

            {activeTab === 'kids' && <KidsView />}

            {activeTab === 'lembretes' && <RemindersView />}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Bottom Floating Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <LandingCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        user={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      <MasterDashboard
        isOpen={isMasterDashOpen}
        onClose={() => setIsMasterDashOpen(false)}
        currentUser={currentUser}
        onMasterLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;
