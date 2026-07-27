import React, { useState } from 'react';
import { BookOpen, Cross, Volume2, Sparkles, Heart, Sun, Bookmark, Calendar, ArrowRight, Share2, Check } from 'lucide-react';
import { TODAY_LITURGY } from '../data/cnbbLiturgy';
import { ActiveTab } from '../components/BottomNav';

interface HomeViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenCheckout: () => void;
  isUnlocked: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenCheckout, isUnlocked }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const textToRead = `Evangelho do Dia: ${TODAY_LITURGY.gospel.reference}. ${TODAY_LITURGY.gospel.text}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'pt-BR';
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert('Seu navegador não possui suporte para reprodução de áudio por voz.');
    }
  };

  const handleGenerateAIReflection = async () => {
    setIsLoadingReflection(true);
    try {
      const res = await fetch('/api/gemini/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gospelText: TODAY_LITURGY.gospel.text,
          reference: TODAY_LITURGY.gospel.reference
        })
      });

      const data = await res.json();
      setIsLoadingReflection(false);
      if (data.reflection) {
        setAiReflection(data.reflection);
      }
    } catch (err) {
      setIsLoadingReflection(false);
      setAiReflection(TODAY_LITURGY.reflection);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Liturgia Diária CNBB',
        text: `${TODAY_LITURGY.gospel.reference}: ${TODAY_LITURGY.gospel.text.slice(0, 100)}...`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner / Header */}
      <div className="relative rounded-3xl navy-panel text-white p-6 sm:p-8 border border-gold shadow-2xl overflow-hidden">
        <div className="texture-overlay"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#F1D592] text-xs font-bold uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{TODAY_LITURGY.colorName}</span>
            </span>

            <span className="text-xs text-gray-300 font-semibold tracking-wider uppercase">
              {TODAY_LITURGY.date}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl serif font-extrabold text-white tracking-wide leading-tight">
              {TODAY_LITURGY.title}
            </h1>
            <p className="text-xs sm:text-sm text-gold mt-1 italic serif">
              "{TODAY_LITURGY.season}"
            </p>
          </div>

          {/* Quick Access Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <button
              onClick={() => onNavigate('liturgia')}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-left flex items-center space-x-2 border border-[#C5A059]/30"
            >
              <BookOpen className="w-4 h-4 text-[#F1D592]" />
              <span className="text-xs font-bold text-white">Liturgia Diária</span>
            </button>

            <button
              onClick={() => onNavigate('oracoes')}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-left flex items-center space-x-2 border border-[#C5A059]/30"
            >
              <Heart className="w-4 h-4 text-rose-300" />
              <span className="text-xs font-bold text-white">Santo Terço</span>
            </button>

            <button
              onClick={() => onNavigate('biblia')}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-left flex items-center space-x-2 border border-[#C5A059]/30"
            >
              <Cross className="w-4 h-4 text-[#F1D592]" />
              <span className="text-xs font-bold text-white">Bíblia CNBB</span>
            </button>

            <button
              onClick={() => onNavigate('kids')}
              className="p-2.5 rounded-xl bg-[#800020] hover:bg-[#800020]/80 transition text-left flex items-center space-x-2 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-[#F1D592]" />
              <span className="text-xs font-bold text-white">Área Kids</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gospel Card of the Day */}
      <div className="bg-white rounded-3xl border border-gold/30 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-gold/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full gold-gradient text-[#002147] flex items-center justify-center font-bold serif shadow-md border border-gold">
              ✝
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-[#800020] tracking-wider block">
                Proclamação do Santo Evangelho
              </span>
              <h2 className="text-lg sm:text-xl serif font-bold text-[#002147]">
                {TODAY_LITURGY.gospel.reference}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeech}
              className={`p-2.5 rounded-full transition ${
                isPlayingAudio
                  ? 'bg-[#C5A059] text-[#002147] animate-pulse'
                  : 'bg-[#C5A059]/10 text-[#002147] hover:bg-[#C5A059]/20'
              }`}
              title="Ouvir leitura em viva voz"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-full transition ${
                isBookmarked ? 'bg-[#800020] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Salvar Leitura"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
              title="Compartilhar"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Gospel Body */}
        <div className="text-base sm:text-lg font-garamond text-gray-800 leading-relaxed whitespace-pre-line bg-[#FDFCF0] p-6 rounded-2xl border border-gold/20 shadow-inner">
          {TODAY_LITURGY.gospel.text}
        </div>

        {/* Homily & Reflection Section */}
        <div className="p-6 rounded-2xl navy-panel text-white space-y-4 shadow-lg border border-gold/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gold/30 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <h3 className="serif font-bold text-lg text-gold">
                Homilia & Reflexão Espiritual Diária
              </h3>
            </div>

            <button
              onClick={handleGenerateAIReflection}
              disabled={isLoadingReflection}
              className="px-3.5 py-1.5 rounded-full gold-gradient text-[#002147] text-xs font-bold hover:opacity-95 transition shadow-md flex items-center space-x-1.5 uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoadingReflection ? 'Gerando...' : 'Aprofundar Reflexão Teológica'}</span>
            </button>
          </div>

          <p className="text-sm font-garamond text-gray-200 leading-relaxed whitespace-pre-line">
            {aiReflection || TODAY_LITURGY.reflection}
          </p>
        </div>

      </div>

      {/* Saint of the Day */}
      <div className="bg-white rounded-3xl border border-gold/30 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 border-b border-gold/20 pb-4">
          <div className="w-10 h-10 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold shadow-md border border-gold">
            ✦
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-gold tracking-wider block">
              Santo do Dia
            </span>
            <h2 className="text-xl sm:text-2xl serif font-bold text-[#002147]">
              {TODAY_LITURGY.saintOfDay.name}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-gold/40 h-64 md:h-full">
            <img
              src={TODAY_LITURGY.saintOfDay.imageUrl}
              alt={TODAY_LITURGY.saintOfDay.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white serif italic">
                {TODAY_LITURGY.saintOfDay.title}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <p className="text-sm sm:text-base font-garamond text-gray-700 leading-relaxed">
              {TODAY_LITURGY.saintOfDay.biography}
            </p>

            <div className="p-4 rounded-xl bg-[#FDFCF0] border border-gold/30 space-y-2">
              <span className="text-xs uppercase font-bold text-[#002147]">Oração a {TODAY_LITURGY.saintOfDay.name}:</span>
              <p className="text-xs sm:text-sm serif italic text-gray-800">
                "{TODAY_LITURGY.saintOfDay.prayer}"
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
