import React from 'react';
import { Cross, ShieldCheck, Download, UserCheck, Key, Lock, Sparkles } from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  user: UserAccount | null;
  onOpenCheckout: () => void;
  onOpenMasterDashboard: () => void;
  onLogout: () => void;
  isPwaInstallable: boolean;
  onInstallPwa: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenCheckout,
  onOpenMasterDashboard,
  onLogout,
  isPwaInstallable,
  onInstallPwa
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#002147] text-[#FDFCF0] border-b border-[#C5A059]/40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[#002147] shadow-lg border border-[#F1D592]">
            <Cross className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="serif font-bold text-lg sm:text-xl tracking-wide text-white">
                Fé e Vida
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/40">
                Premium
              </span>
            </div>
            <p className="text-[11px] text-[#C5A059] tracking-tight font-medium hidden sm:block">
              CNBB • Liturgia & Bíblia Sagrada
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* PWA Install Button */}
          {isPwaInstallable && (
            <button
              onClick={onInstallPwa}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#C5A059]/20 text-[#F1D592] hover:bg-[#C5A059]/30 transition border border-[#C5A059]/50 shadow-sm uppercase tracking-wider"
              title="Instalar aplicativo na tela inicial"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instalar App</span>
            </button>
          )}

          {/* User Status & Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-2">
              {user.role === 'admin' ? (
                <button
                  onClick={onOpenMasterDashboard}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900 transition shadow-sm uppercase tracking-wider"
                  title="Painel Master Administrador"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Painel Master</span>
                </button>
              ) : user.paymentStatus === 'approved' ? (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#C5A059]/20 text-[#F1D592] border border-[#C5A059]/50 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="hidden md:inline font-medium">Assinante Premium</span>
                </div>
              ) : (
                <button
                  onClick={onOpenCheckout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold gold-gradient text-[#002147] hover:opacity-95 transition shadow-md uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Página de Vendas (R$ 19)</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition"
                title="Sair da conta"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenMasterDashboard}
                className="p-2 text-gray-300 hover:text-[#C5A059] transition rounded-full hover:bg-white/10"
                title="Acesso Master"
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCheckout}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold gold-gradient text-[#002147] hover:opacity-95 transition shadow-md uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Página de Vendas (R$ 19,00)</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
