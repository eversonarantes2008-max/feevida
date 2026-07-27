import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, Check, Volume2, Sparkles, Cross } from 'lucide-react';
import { TODAY_LITURGY, LITURGY_OF_HOURS, ROMAN_MISSAL_PARTS } from '../data/cnbbLiturgy';

export const LiturgyView: React.FC = () => {
  const [subTab, setSubTab] = useState<'diaria' | 'horas' | 'missal'>('diaria');
  const [hourSection, setHourSection] = useState<'laudes' | 'horaMedia' | 'vesperas' | 'completas'>('laudes');

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
            Liturgia Diária CNBB
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

      {/* Liturgia Diária CNBB */}
      {subTab === 'diaria' && (
        <div className="space-y-6">
          
          {/* Header */}
          <div className="bg-[#0B1B3D] text-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/30 shadow-lg text-center space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold uppercase tracking-wider">
              {TODAY_LITURGY.colorName}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-title font-bold gold-gradient-text">
              Liturgia Diária do Dia
            </h2>
            <p className="text-xs text-slate-300 font-serif">{TODAY_LITURGY.date}</p>
          </div>

          {/* 1ª Leitura */}
          <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-amber-200 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <span className="font-bold text-xs uppercase text-[#5B1422] tracking-wider">Primeira Leitura</span>
              <span className="font-serif font-bold text-sm text-[#0B1B3D]">{TODAY_LITURGY.firstReading.reference}</span>
            </div>
            <p className="text-base font-garamond text-slate-800 leading-relaxed whitespace-pre-line">
              {TODAY_LITURGY.firstReading.text}
            </p>
          </div>

          {/* Salmo Responsorial */}
          <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="font-bold text-xs uppercase text-[#0B1B3D] tracking-wider">Salmo Responsorial</span>
              <span className="font-serif font-bold text-sm text-[#0B1B3D]">{TODAY_LITURGY.psalm.reference}</span>
            </div>

            <div className="p-3.5 bg-amber-100/80 rounded-xl border border-amber-300/80 text-center font-serif font-bold text-sm text-[#5B1422]">
              R. {TODAY_LITURGY.psalm.response}
            </div>

            <div className="space-y-3 font-garamond text-base text-slate-800">
              {TODAY_LITURGY.psalm.stanzas.map((stanza, idx) => (
                <p key={idx} className="pl-4 border-l-2 border-[#D4AF37]">
                  {stanza}
                </p>
              ))}
            </div>
          </div>

          {/* 2ª Leitura */}
          {TODAY_LITURGY.secondReading && (
            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-amber-200 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <span className="font-bold text-xs uppercase text-[#5B1422] tracking-wider">Segunda Leitura</span>
                <span className="font-serif font-bold text-sm text-[#0B1B3D]">{TODAY_LITURGY.secondReading.reference}</span>
              </div>
              <p className="text-base font-garamond text-slate-800 leading-relaxed whitespace-pre-line">
                {TODAY_LITURGY.secondReading.text}
              </p>
            </div>
          )}

          {/* Evangelho */}
          <div className="bg-[#0B1B3D] text-[#FDFBF7] p-6 sm:p-8 rounded-2xl border-2 border-[#D4AF37]/50 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <span className="font-bold text-xs uppercase text-[#F3E5AB] tracking-wider">Santo Evangelho</span>
              <span className="font-serif font-bold text-base gold-gradient-text">{TODAY_LITURGY.gospel.reference}</span>
            </div>
            <p className="text-lg font-garamond text-slate-100 leading-relaxed whitespace-pre-line">
              {TODAY_LITURGY.gospel.text}
            </p>
          </div>

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
