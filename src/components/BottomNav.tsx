import React from 'react';
import { BookOpen, Calendar, Cross, Heart, Bell, Baby } from 'lucide-react';

export type ActiveTab = 'hoje' | 'liturgia' | 'biblia' | 'oracoes' | 'kids' | 'lembretes';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'hoje' as ActiveTab, label: 'Hoje', icon: Calendar },
    { id: 'liturgia' as ActiveTab, label: 'Liturgia', icon: BookOpen },
    { id: 'biblia' as ActiveTab, label: 'Bíblia', icon: Cross },
    { id: 'oracoes' as ActiveTab, label: 'Orações', icon: Heart },
    { id: 'kids' as ActiveTab, label: 'Kids', icon: Baby },
    { id: 'lembretes' as ActiveTab, label: 'Lembretes', icon: Bell },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#002147]/95 backdrop-blur-md border-t border-[#C5A059]/40 text-gray-300 shadow-2xl">
      <div className="max-w-md mx-auto px-2 flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-[#C5A059] font-bold scale-105'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#C5A059] shadow-sm'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-tight uppercase font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
