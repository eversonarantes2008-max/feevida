import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, Check, Volume2, Sparkles, Cross, RefreshCw, ChevronLeft, ChevronRight, Heart, Feather } from 'lucide-react';
import { TODAY_LITURGY, LITURGY_OF_HOURS, ROMAN_MISSAL_PARTS } from '../data/cnbbLiturgy';
import { LiturgicalDay } from '../types';

export const LiturgyView: React.FC = () => {
  const [subTab, setSubTab] = useState<'diaria' | 'horas' | 'missal'>('diaria');
  const [hourSection, setHourSection] = useState<'laudes' | 'horaMedia' | 'vesperas' | 'completas'>('laudes');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Date selection state
  const getTodayISO = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());
  const [liturgy, setLiturgy] = useState<LiturgicalDay>(TODAY_LITURGY);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>('');

  // Fetch liturgy dynamically from API
  const fetchDailyLiturgy = async (dateStr: string) => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`/api/liturgy/daily?date=${dateStr}`);
      const data = await res.json();
      setLoading(false);

      if (data.liturgy && data.liturgy.gospel) {
        setLiturgy(data.liturgy);
      } else {
        // Fallback to TODAY_LITURGY if same date as today, or default
        setLiturgy(TODAY_LITURGY);
        setFetchError('Exibindo liturgia do dia principal.');
      }
    } catch (err) {
      console.error('Error fetching liturgy:', err);
      setLoading(false);
      setLiturgy(TODAY_LITURGY);
      setFetchError('Não foi possível conectar ao servidor. Exibindo liturgia local.');
    }
  };

  useEffect(() => {
    fetchDailyLiturgy(selectedDate);
  }, [selectedDate]);

  const handleDateShift = (days: number) => {
    const parts = selectedDate.split('-');
    const currentDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    currentDate.setDate(currentDate.getDate() + days);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;

        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(v => v.lang.startsWith('pt') || v.lang.includes('BR') || v.lang.includes('PT'));
        if (ptVoice) {
          utterance.voice = ptVoice;
        }

        utterance.onstart = () => setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert('Seu navegador não suporta leitura em áudio.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Subtabs Selector */}
      <div className="flex justify-center">
        <div className="bg-[#0B1B3D] p-1.5 rounded-full border border-[#D4AF37]/40 shadow-lg flex space-x-1">
          <button
            onClick={() => setSubTab('diaria')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
              subTab === 'diaria'
                ? 'gold-gradient-bg text-[#0B1B3D] shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Liturgia Diária CNBB & Canção Nova
          </button>

          <button
            onClick={() => setSubTab('horas')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
              subTab === 'horas'
                ? 'gold-gradient-bg text-[#0B1B3D] shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Liturgia das Horas
          </button>

          <button
            onClick={() => setSubTab('missal')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
              subTab === 'missal'
                ? 'gold-gradient-bg text-[#0B1B3D] shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Missal Romano
          </button>
        </div>
      </div>

      {/* Liturgia Diária CNBB & Canção Nova */}
      {subTab === 'diaria' && (
        <div className="space-y-6">
          
          {/* Daily Date Selector Bar */}
          <div className="bg-[#0B1B3D] text-[#FDFBF7] p-5 sm:p-6 rounded-2xl border border-[#D4AF37]/40 shadow-xl space-y-4 text-center">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <span className="font-bold text-xs uppercase tracking-wider text-[#F3E5AB]">
                  Atualização Diária Oficial
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#F3E5AB] text-[11px] font-bold border border-[#D4AF37]/40">
                CNBB & Canção Nova
              </span>
            </div>

            {/* Date Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={() => handleDateShift(-1)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-[#F3E5AB] rounded-xl border border-[#D4AF37]/30 transition flex items-center space-x-1 text-xs font-bold"
                title="Dia Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Ontem</span>
              </button>

              <button
                onClick={() => setSelectedDate(getTodayISO())}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition border ${
                  selectedDate === getTodayISO()
                    ? 'gold-gradient-bg text-[#0B1B3D] border-[#D4AF37] shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20 border-[#D4AF37]/30'
                }`}
              >
                Hoje
              </button>

              <button
                onClick={() => handleDateShift(1)}
                className="p-2.5 bg-white/10 hover:bg-white/20 text-[#F3E5AB] rounded-xl border border-[#D4AF37]/30 transition flex items-center space-x-1 text-xs font-bold"
                title="Próximo Dia"
              >
                <span className="hidden sm:inline">Amanhã</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="relative inline-flex items-center ml-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                  className="px-3 py-2 bg-[#00152e] border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-mono font-bold rounded-xl outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                onClick={() => fetchDailyLiturgy(selectedDate)}
                disabled={loading}
                className="p-2.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#F3E5AB] rounded-xl border border-[#D4AF37]/40 transition ml-1"
                title="Atualizar Liturgia"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
              </button>
            </div>

            {/* Title & Color */}
            <div className="pt-2 space-y-1">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
                {liturgy.colorName || 'Cor Litúrgica'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-title font-bold gold-gradient-text pt-1">
                {liturgy.title || 'Liturgia Diária Oficial'}
              </h2>
              <p className="text-sm text-slate-200 font-serif">{liturgy.date}</p>
              {liturgy.season && (
                <p className="text-xs text-[#D4AF37] font-semibold italic">{liturgy.season}</p>
              )}
            </div>

            {/* Audio Speech Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const secondText = liturgy.secondReading ? `Segunda Leitura: ${liturgy.secondReading.text}.` : '';
                  const textToRead = `Liturgia Diária para ${liturgy.date}. Primeira leitura: ${liturgy.firstReading.text}. Salmo Responsorial: Refrão: ${liturgy.psalm.response}. ${liturgy.psalm.stanzas.join(' ')}. ${secondText} Santo Evangelho: ${liturgy.gospel.text}`;
                  handleSpeech(textToRead);
                }}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition inline-flex items-center space-x-2 ${
                  isPlayingAudio
                    ? 'bg-[#D4AF37] text-[#0B1B3D] animate-pulse border border-white shadow-lg'
                    : 'bg-white/10 text-[#F3E5AB] hover:bg-white/20 border border-[#D4AF37]/50 shadow-md'
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{isPlayingAudio ? 'Parar Leitura em Áudio' : 'Ouvir Liturgia em Áudio'}</span>
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="p-8 bg-[#FDFBF7] rounded-2xl border-2 border-[#D4AF37] text-center space-y-3 shadow-xl animate-pulse">
              <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto" />
              <p className="text-sm font-bold text-[#0B1B3D] font-serif">
                Buscando Liturgia Diária Oficial atualizada de acordo com a CNBB e Canção Nova...
              </p>
            </div>
          )}

          {/* Liturgy Contents */}
          {!loading && (
            <div className="space-y-6">

              {/* Santo do Dia (if present) */}
              {liturgy.saintOfDay && liturgy.saintOfDay.name && (
                <div className="bg-[#0B1B3D] text-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/40 shadow-lg space-y-4">
                  <div className="flex items-center space-x-2 border-b border-[#D4AF37]/30 pb-3">
                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#F3E5AB]">
                      Santo do Dia • Comemoração Litúrgica
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-5 items-center md:items-start">
                    {liturgy.saintOfDay.imageUrl && (
                      <img
                        src={liturgy.saintOfDay.imageUrl}
                        alt={liturgy.saintOfDay.name}
                        className="w-28 h-28 object-cover rounded-2xl border-2 border-[#D4AF37] shadow-md shrink-0"
                      />
                    )}
                    <div className="space-y-2 text-center md:text-left">
                      <h3 className="text-xl font-serif-title font-bold gold-gradient-text">
                        {liturgy.saintOfDay.name}
                      </h3>
                      <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
                        {liturgy.saintOfDay.title}
                      </p>
                      <p className="text-xs font-garamond text-slate-200 leading-relaxed">
                        {liturgy.saintOfDay.biography}
                      </p>
                      {liturgy.saintOfDay.prayer && (
                        <div className="p-3 bg-white/10 rounded-xl border border-[#D4AF37]/30 text-xs italic font-serif text-[#F3E5AB]">
                          "{liturgy.saintOfDay.prayer}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 1ª Leitura */}
              <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-amber-200 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <span className="font-bold text-xs uppercase text-[#5B1422] tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    Primeira Leitura
                  </span>
                  <span className="font-serif font-bold text-sm text-[#0B1B3D]">{liturgy.firstReading.reference}</span>
                </div>
                <p className="text-base font-garamond text-slate-800 leading-relaxed whitespace-pre-line">
                  {liturgy.firstReading.text}
                </p>
              </div>

              {/* Salmo Responsorial */}
              <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <span className="font-bold text-xs uppercase text-[#0B1B3D] tracking-wider">Salmo Responsorial</span>
                  <span className="font-serif font-bold text-sm text-[#0B1B3D]">{liturgy.psalm.reference}</span>
                </div>

                <div className="p-3.5 bg-amber-100/80 rounded-xl border border-amber-300/80 text-center font-serif font-bold text-sm text-[#5B1422]">
                  R. {liturgy.psalm.response}
                </div>

                <div className="space-y-3 font-garamond text-base text-slate-800">
                  {liturgy.psalm.stanzas.map((stanza, idx) => (
                    <p key={idx} className="pl-4 border-l-2 border-[#D4AF37]">
                      {stanza}
                    </p>
                  ))}
                </div>
              </div>

              {/* 2ª Leitura (se houver) */}
              {liturgy.secondReading && liturgy.secondReading.text && (
                <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-amber-200 shadow-md space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                    <span className="font-bold text-xs uppercase text-[#5B1422] tracking-wider">Segunda Leitura</span>
                    <span className="font-serif font-bold text-sm text-[#0B1B3D]">{liturgy.secondReading.reference}</span>
                  </div>
                  <p className="text-base font-garamond text-slate-800 leading-relaxed whitespace-pre-line">
                    {liturgy.secondReading.text}
                  </p>
                </div>
              )}

              {/* Evangelho */}
              <div className="bg-[#0B1B3D] text-[#FDFBF7] p-6 sm:p-8 rounded-2xl border-2 border-[#D4AF37]/50 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                  <span className="font-bold text-xs uppercase text-[#F3E5AB] tracking-wider flex items-center gap-2">
                    <Cross className="w-4 h-4 text-[#D4AF37]" />
                    Santo Evangelho
                  </span>
                  <span className="font-serif font-bold text-base gold-gradient-text">{liturgy.gospel.reference}</span>
                </div>
                <p className="text-lg font-garamond text-slate-100 leading-relaxed whitespace-pre-line">
                  {liturgy.gospel.text}
                </p>
              </div>

              {/* Reflexão Pastoral CNBB / Canção Nova */}
              {liturgy.reflection && (
                <div className="bg-amber-50 p-6 sm:p-8 rounded-2xl border border-amber-300 shadow-lg space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="font-bold text-xs uppercase text-[#0B1B3D] tracking-wider flex items-center gap-1.5">
                      <Feather className="w-4 h-4 text-[#5B1422]" />
                      Reflexão Homilética CNBB & Canção Nova
                    </span>
                  </div>
                  <p className="text-base font-garamond text-slate-800 leading-relaxed whitespace-pre-line">
                    {liturgy.reflection}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Liturgia das Horas */}
      {subTab === 'horas' && (
        <div className="space-y-6">
          
          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {[
              { id: 'laudes', name: 'Laudes (Manhã)' },
              { id: 'horaMedia', name: 'Hora Média (Dia)' },
              { id: 'vesperas', name: 'Vésperas (Tarde)' },
              { id: 'completas', name: 'Completas (Noite)' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setHourSection(item.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  hourSection === item.id
                    ? 'bg-[#0B1B3D] text-[#F3E5AB] border border-[#D4AF37] shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Selected Hour Content */}
          {(() => {
            const currentHour = LITURGY_OF_HOURS[hourSection];
            return (
              <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-2xl border border-amber-200 shadow-lg space-y-6">
                <div className="border-b border-amber-200 pb-3">
                  <h3 className="text-2xl font-serif-title font-bold text-[#0B1B3D]">
                    {currentHour.title}
                  </h3>
                </div>

                {/* Hymn */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="text-xs font-bold text-[#5B1422] uppercase">Hino da Hora</span>
                  <p className="text-sm font-garamond italic text-slate-800">{currentHour.hymn}</p>
                </div>

                {/* Psalms */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-[#0B1B3D] uppercase tracking-wider">Salmódia</h4>
                  {currentHour.psalms.map((psalm, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between font-serif font-bold text-xs text-[#0B1B3D]">
                        <span>{psalm.title}</span>
                        <span className="text-[#5B1422]">{psalm.ref}</span>
                      </div>
                      <p className="text-sm font-garamond text-slate-800">{psalm.text}</p>
                    </div>
                  ))}
                </div>

                {/* Short Reading */}
                <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-700 space-y-1">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase">Leitura Breve</span>
                  <p className="text-sm font-garamond">{currentHour.shortReading}</p>
                </div>

                {/* Prayer */}
                <div className="p-4 bg-amber-100/80 rounded-xl border border-amber-300 text-center space-y-1">
                  <span className="text-xs font-bold text-[#0B1B3D] uppercase">Oração Conclusiva</span>
                  <p className="text-sm font-serif italic text-[#0B1B3D]">{currentHour.prayer}</p>
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* Missal Romano */}
      {subTab === 'missal' && (
        <div className="space-y-6">
          <div className="bg-[#0B1B3D] text-white p-6 rounded-2xl border border-[#D4AF37] text-center space-y-2">
            <h2 className="text-2xl font-serif-title font-bold gold-gradient-text">
              Missal Romano Completo
            </h2>
            <p className="text-xs text-slate-300">
              Acompanhe todas as partes e orações da Celebração Eucarística segundo as normas da Santa Sé e CNBB.
            </p>
          </div>

          <div className="space-y-6">
            {ROMAN_MISSAL_PARTS.map((part, idx) => (
              <div key={idx} className="bg-[#FDFBF7] p-6 rounded-2xl border border-amber-200 shadow-md space-y-4">
                <h3 className="text-lg font-serif-title font-bold text-[#5B1422] border-b border-amber-200 pb-2">
                  {idx + 1}. {part.section}
                </h3>

                <div className="space-y-3">
                  {part.parts.map((p, pIdx) => (
                    <div key={pIdx} className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
                      <h4 className="font-bold text-xs text-[#0B1B3D] uppercase">{p.title}</h4>
                      <p className="text-sm font-garamond text-slate-800">{p.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
