import React, { useState } from 'react';
import { Heart, Sparkles, Cross, ChevronRight, Check, BookOpen, Volume2, RotateCcw, Search, Bookmark, Star, VolumeX } from 'lucide-react';
import { ROSARY_MYSTERIES, VIA_SACRA_STATIONS, CATHOLIC_PRAYERS_COLLECTION, SAINTS_DATABASE, NOVENA_DESATADORA } from '../data/catholicPrayers';

export const PrayersView: React.FC = () => {
  const [subSection, setSubSection] = useState<'devocionario' | 'terco' | 'misericordia' | 'viasacra' | 'novenas' | 'santos' | 'catecismo'>('devocionario');
  
  // Devocionário Filters & Controls
  const [devocionarioCategory, setDevocionarioCategory] = useState<string>('Todas');
  const [searchPrayer, setSearchPrayer] = useState<string>('');
  const [bookmarkedPrayers, setBookmarkedPrayers] = useState<string[]>([]);
  const [speakingPrayerId, setSpeakingPrayerId] = useState<string | null>(null);

  // Rosary Interactive Bead State
  const [rosaryType, setRosaryType] = useState<'gozosos' | 'luminosos' | 'dolorosos' | 'gloriosos'>('gozosos');
  const [currentMysteryIndex, setCurrentMysteryIndex] = useState(0);
  const [beadCount, setBeadCount] = useState(0);

  // Catechism AI Question state
  const [catechismQuestion, setCatechismQuestion] = useState('');
  const [catechismAnswer, setCatechismAnswer] = useState('');
  const [isAskingCatechist, setIsAskingCatechist] = useState(false);

  // Novena Tracker
  const [novenaDay, setNovenaDay] = useState(1);

  const activeRosary = ROSARY_MYSTERIES[rosaryType];
  const currentMystery = activeRosary.mysteries[currentMysteryIndex];

  const handleNextBead = () => {
    if (beadCount < 10) {
      setBeadCount(beadCount + 1);
    } else {
      setBeadCount(0);
      if (currentMysteryIndex < 4) {
        setCurrentMysteryIndex(currentMysteryIndex + 1);
      }
    }
  };

  const toggleBookmark = (id: string) => {
    if (bookmarkedPrayers.includes(id)) {
      setBookmarkedPrayers(bookmarkedPrayers.filter(i => i !== id));
    } else {
      setBookmarkedPrayers([...bookmarkedPrayers, id]);
    }
  };

  const handleSpeakPrayer = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingPrayerId === id) {
        window.speechSynthesis.cancel();
        setSpeakingPrayerId(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.onend = () => setSpeakingPrayerId(null);
        window.speechSynthesis.speak(utterance);
        setSpeakingPrayerId(id);
      }
    }
  };

  const handleAskCatechist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catechismQuestion) return;

    setIsAskingCatechist(true);
    try {
      const res = await fetch('/api/gemini/catechism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: catechismQuestion })
      });
      const data = await res.json();
      setIsAskingCatechist(false);
      if (data.answer) {
        setCatechismAnswer(data.answer);
      }
    } catch (err) {
      setIsAskingCatechist(false);
      setCatechismAnswer('Erro ao consultar o Catequista Virtual. Tente novamente.');
    }
  };

  const filteredPrayers = CATHOLIC_PRAYERS_COLLECTION.filter(p => {
    const matchesCat = devocionarioCategory === 'Todas' || p.category === devocionarioCategory || (devocionarioCategory === 'Favoritas' && bookmarkedPrayers.includes(p.id));
    const matchesSearch = p.title.toLowerCase().includes(searchPrayer.toLowerCase()) || p.content.toLowerCase().includes(searchPrayer.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Sub-navigation bar */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="flex justify-start sm:justify-center space-x-2 shrink-0">
          {[
            { id: 'devocionario', label: '📖 Devocionário Católico' },
            { id: 'terco', label: '📿 Santo Rosário' },
            { id: 'misericordia', label: '✝ Misericórdia' },
            { id: 'viasacra', label: '⛪ Via-Sacra' },
            { id: 'novenas', label: '🌹 Novenas' },
            { id: 'santos', label: '🕊️ Vida dos Santos' },
            { id: 'catecismo', label: '🏛️ Catecismo CIC' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSubSection(item.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 ${
                subSection === item.id
                  ? 'bg-[#002147] text-[#F1D592] border border-[#C5A059] shadow-md uppercase tracking-wider'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Devocionário Católico */}
      {subSection === 'devocionario' && (
        <div className="space-y-6">
          <div className="bg-[#002147] text-white p-6 rounded-2xl border border-[#C5A059] shadow-xl text-center space-y-2 relative overflow-hidden">
            <div className="texture-overlay"></div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#F1D592] text-xs font-bold uppercase tracking-widest">
              Devocionário do Fiel Católico
            </span>
            <h2 className="text-2xl sm:text-3xl serif font-bold text-gold">
              Orações & Práticas de Devoção
            </h2>
            <p className="text-xs text-gray-300 font-medium max-w-xl mx-auto">
              Tesouro de orações diárias, ladainhas, atos de piedade e consagrações recomendadas pela Igreja Católica
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#C5A059]/30 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar oração ou tema..."
                  value={searchPrayer}
                  onChange={(e) => setSearchPrayer(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-xs bg-[#FDFCF0] focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                {['Todas', 'Diárias', 'Nossa Senhora', 'Proteção e Liberação', 'Eucaristia e Adoração', 'Familia e Paz', 'Anjos e Santos', 'Favoritas'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDevocionarioCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                      devocionarioCategory === cat
                        ? 'bg-[#800020] text-white border border-gold shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'Favoritas' ? `⭐ Favoritas (${bookmarkedPrayers.length})` : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prayers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrayers.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-gray-200 text-gray-500">
                Nenhuma oração encontrada para os filtros selecionados.
              </div>
            ) : (
              filteredPrayers.map((prayer) => {
                const isBookmarked = bookmarkedPrayers.includes(prayer.id);
                const isSpeaking = speakingPrayerId === prayer.id;

                return (
                  <div key={prayer.id} className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-md space-y-3 flex flex-col justify-between hover:border-[#C5A059] transition">
                    <div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#800020] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {prayer.category}
                          </span>
                          <h4 className="serif font-bold text-base text-[#002147] mt-1">{prayer.title}</h4>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleSpeakPrayer(prayer.id, prayer.content)}
                            className={`p-2 rounded-full transition ${
                              isSpeaking ? 'bg-[#C5A059] text-[#002147] animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title="Ouvir em viva voz"
                          >
                            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => toggleBookmark(prayer.id)}
                            className={`p-2 rounded-full transition ${
                              isBookmarked ? 'bg-[#800020] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                            title="Salvar oração"
                          >
                            <Star className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-garamond text-gray-800 leading-relaxed whitespace-pre-line bg-[#FDFCF0] p-4 rounded-xl border border-gold/10">
                        {prayer.content}
                      </p>

                      {prayer.latinContent && (
                        <div className="mt-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/50 text-xs italic serif text-gray-700">
                          <span className="font-bold text-[#800020] uppercase text-[10px] block mb-0.5">Versão em Latim:</span>
                          {prayer.latinContent}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400 font-semibold border-t border-gray-100">
                      <span>Devocionário Católico • Fé e Vida</span>
                      <span>CNBB</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Santo Rosário & Terço Interativo */}
      {subSection === 'terco' && (
        <div className="space-y-6">
          
          {/* Mystery Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'gozosos', label: 'Gozosos (Seg/Sáb)' },
              { id: 'luminosos', label: 'Luminosos (Qui)' },
              { id: 'dolorosos', label: 'Dolorosos (Ter/Sex)' },
              { id: 'gloriosos', label: 'Gloriosos (Qua/Dom)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setRosaryType(m.id as any);
                  setCurrentMysteryIndex(0);
                  setBeadCount(0);
                }}
                className={`p-3 rounded-xl border text-xs font-bold transition text-center ${
                  rosaryType === m.id
                    ? 'bg-[#5B1422] text-[#F3E5AB] border-[#D4AF37] shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Active Mystery Card */}
          <div className="bg-[#FDFBF7] p-6 rounded-3xl border border-amber-200 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-[#5B1422]">{activeRosary.name}</span>
                <h3 className="text-xl sm:text-2xl font-serif-title font-bold text-[#0B1B3D]">
                  {currentMystery.number}º Mistério: {currentMystery.title}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">{currentMystery.biblicalRef}</span>
            </div>

            {/* Image & Meditation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-amber-300 h-48 md:h-full">
                <img
                  src={currentMystery.imageUrl}
                  alt={currentMystery.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-[#0B1B3D]">
                  Fruto do Mistério: <span className="text-[#5B1422] font-semibold">{currentMystery.fruit}</span>
                </div>
                <p className="text-base font-garamond text-slate-800 leading-relaxed bg-[#F9F6F0] p-4 rounded-xl border border-amber-100">
                  {currentMystery.meditation}
                </p>
              </div>
            </div>

            {/* Virtual Beads Counter */}
            <div className="bg-[#0B1B3D] text-[#FDFBF7] p-6 rounded-2xl border border-[#D4AF37]/40 shadow-inner text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3E5AB] block">
                Contador de Ave-Marias ({beadCount} / 10)
              </span>

              {/* 10 Bead Indicators */}
              <div className="flex justify-center items-center space-x-2 sm:space-x-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <div
                    key={num}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                      num <= beadCount
                        ? 'gold-gradient-bg text-[#0B1B3D] border-[#F3E5AB] scale-110 shadow-md'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-3 pt-2">
                <button
                  onClick={handleNextBead}
                  className="px-6 py-3 rounded-xl gold-gradient-bg text-[#0B1B3D] font-extrabold text-sm hover:opacity-95 transition shadow-lg border border-[#F3E5AB]"
                >
                  {beadCount < 10 ? 'Rezar Próxima Ave-Maria (+1)' : 'Avançar para o Próximo Mistério ➔'}
                </button>

                <button
                  onClick={() => setBeadCount(0)}
                  className="p-3 bg-slate-800 text-slate-300 hover:text-white rounded-xl transition"
                  title="Reiniciar contagem"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Terço da Misericórdia */}
      {subSection === 'misericordia' && (
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xl space-y-6">
          <div className="border-b border-amber-200 pb-3">
            <span className="text-xs uppercase font-bold text-[#5B1422]">Revelado a Santa Faustina Kowalska</span>
            <h3 className="text-2xl font-serif-title font-bold text-[#0B1B3D]">
              Terço da Divina Misericórdia (15h)
            </h3>
          </div>

          <div className="space-y-4 text-slate-800 font-garamond text-base">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-xs uppercase text-[#0B1B3D] mb-1">Pai Nosso e Ave Maria Inicial</h4>
              <p>Comece fazendo o Sinal da Cruz, rezando 1 Pai Nosso, 1 Ave Maria e o Credo.</p>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-700 space-y-1">
              <h4 className="font-bold text-xs uppercase text-[#D4AF37]">Nas contas do Pai Nosso:</h4>
              <p className="font-serif italic text-amber-200 text-base">
                "Eterno Pai, eu Vos ofereço o Corpo e o Sangue, a Alma e a Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro."
              </p>
            </div>

            <div className="p-4 bg-amber-100 rounded-xl border border-amber-300 space-y-1">
              <h4 className="font-bold text-xs uppercase text-[#5B1422]">Nas 10 contas da Ave Maria:</h4>
              <p className="font-serif italic text-[#0B1B3D] text-base">
                "Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro."
              </p>
            </div>

            <div className="p-4 bg-[#5B1422] text-[#F3E5AB] rounded-xl border border-rose-800 space-y-1">
              <h4 className="font-bold text-xs uppercase text-amber-200">Ao final das 5 dezenas (3 vezes):</h4>
              <p className="font-serif italic text-base">
                "Deus Santo, Deus Forte, Deus Imortal, tende piedade de nós e do mundo inteiro."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Via Sacra */}
      {subSection === 'viasacra' && (
        <div className="space-y-6">
          <div className="bg-[#0B1B3D] text-white p-6 rounded-2xl border border-[#D4AF37] text-center space-y-2">
            <h2 className="text-2xl font-serif-title font-bold gold-gradient-text">
              As 14 Estações da Via-Sacra
            </h2>
            <p className="text-xs text-slate-300">Meditação ilustrada dos caminhos de Cristo até o Calvário</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VIA_SACRA_STATIONS.map((station) => (
              <div key={station.number} className="bg-[#FDFBF7] p-5 rounded-2xl border border-amber-200 shadow-md space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B1422] text-[#F3E5AB] font-bold text-xs flex items-center justify-center shrink-0">
                    {station.number}
                  </div>
                  <h4 className="font-serif-title font-bold text-sm text-[#0B1B3D]">
                    {station.title}
                  </h4>
                </div>

                <p className="text-xs font-serif italic text-[#5B1422] bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  "{station.prayer}"
                </p>

                <p className="text-xs font-garamond text-slate-700 leading-relaxed">
                  {station.reflection}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Novenas */}
      {subSection === 'novenas' && (
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xl space-y-6">
          <div className="border-b border-amber-200 pb-3">
            <span className="text-xs uppercase font-bold text-[#5B1422]">Novena Preparada</span>
            <h3 className="text-2xl font-serif-title font-bold text-[#0B1B3D]">
              {NOVENA_DESATADORA.title}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">{NOVENA_DESATADORA.subtitle}</p>
          </div>

          {/* Day Tracker 1 to 9 */}
          <div className="flex justify-between items-center space-x-1 sm:space-x-2 bg-amber-50 p-3 rounded-xl border border-amber-200">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => setNovenaDay(d)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs font-bold transition ${
                  novenaDay === d
                    ? 'bg-[#5B1422] text-[#F3E5AB] border border-[#D4AF37] shadow-md'
                    : 'bg-white text-slate-700 hover:bg-amber-100'
                }`}
              >
                {d}º Dia
              </button>
            ))}
          </div>

          <div className="p-6 bg-[#F9F6F0] rounded-2xl border border-amber-200 space-y-3">
            <h4 className="font-serif-title font-bold text-lg text-[#0B1B3D]">
              {NOVENA_DESATADORA.days[novenaDay - 1].theme}
            </h4>
            <p className="text-xs font-semibold text-[#5B1422]">
              Intenção: {NOVENA_DESATADORA.days[novenaDay - 1].intention}
            </p>
            <p className="text-base font-garamond text-slate-800 leading-relaxed">
              {NOVENA_DESATADORA.days[novenaDay - 1].prayer}
            </p>
          </div>
        </div>
      )}

      {/* Orações Católicas Tradicionais */}
      {subSection === 'oracoes' && (
        <div className="space-y-4">
          <div className="bg-[#0B1B3D] text-white p-5 rounded-2xl border border-[#D4AF37] text-center">
            <h2 className="text-xl font-serif-title font-bold gold-gradient-text">
              Biblioteca de Orações Católicas Tradicionais
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATHOLIC_PRAYERS_COLLECTION.map((prayer) => (
              <div key={prayer.id} className="bg-[#FDFBF7] p-5 rounded-2xl border border-amber-200 shadow-md space-y-2">
                <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                  <h4 className="font-serif-title font-bold text-base text-[#0B1B3D]">{prayer.title}</h4>
                  <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {prayer.category}
                  </span>
                </div>
                <p className="text-sm font-garamond text-slate-800 leading-relaxed">
                  {prayer.content}
                </p>
                {prayer.latinContent && (
                  <div className="pt-2 border-t border-amber-100 text-xs italic font-serif text-slate-600">
                    <span className="font-bold text-amber-900 uppercase text-[10px] block">Em Latim:</span>
                    {prayer.latinContent}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vida dos Santos */}
      {subSection === 'santos' && (
        <div className="space-y-6">
          <div className="bg-[#0B1B3D] text-white p-6 rounded-2xl border border-[#D4AF37] text-center space-y-1">
            <h2 className="text-2xl font-serif-title font-bold gold-gradient-text">
              Galeria dos Santos da Igreja
            </h2>
            <p className="text-xs text-slate-300">Biografias, patronatos e orações milagrosas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAINTS_DATABASE.map((saint) => (
              <div key={saint.id} className="bg-[#FDFBF7] p-6 rounded-2xl border border-amber-200 shadow-lg space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={saint.imageUrl}
                    alt={saint.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#D4AF37] shadow-md shrink-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#5B1422]">{saint.feastDay}</span>
                    <h3 className="font-serif-title font-bold text-lg text-[#0B1B3D]">{saint.name}</h3>
                    <p className="text-xs text-slate-600 font-serif italic">{saint.patronage}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-garamond text-slate-700 leading-relaxed">
                  {saint.biography}
                </p>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-serif italic text-slate-800">
                  "{saint.prayer}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Catecismo da Igreja Católica + Gemini Catechist */}
      {subSection === 'catecismo' && (
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xl space-y-6">
          <div className="border-b border-amber-200 pb-3">
            <span className="text-xs uppercase font-bold text-[#5B1422]">Doutrina Oficial da Igreja</span>
            <h3 className="text-2xl font-serif-title font-bold text-[#0B1B3D]">
              Catequista Virtual - Catecismo (CIC)
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Faça qualquer pergunta sobre fé, moral, sacramentos ou virtudes e receba a resposta fundamentada no Catecismo da Igreja Católica.
            </p>
          </div>

          <form onSubmit={handleAskCatechist} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Ex: O que é o sacramento da Reconciliação / Confissão?"
                value={catechismQuestion}
                onChange={(e) => setCatechismQuestion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={isAskingCatechist}
                className="px-5 py-3 gold-gradient-bg text-[#0B1B3D] font-extrabold text-xs rounded-xl hover:opacity-95 transition shrink-0 flex items-center space-x-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAskingCatechist ? 'Consultando...' : 'Perguntar'}</span>
              </button>
            </div>
          </form>

          {catechismAnswer && (
            <div className="p-6 bg-gradient-to-br from-[#0B1B3D] to-[#122853] text-[#FDFBF7] rounded-2xl border border-[#D4AF37]/40 shadow-lg space-y-3">
              <div className="flex items-center space-x-2 border-b border-[#D4AF37]/30 pb-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-serif-title font-bold text-base gold-gradient-text">
                  Resposta da Doutrina Católica
                </h4>
              </div>
              <p className="text-sm font-garamond text-slate-200 leading-relaxed whitespace-pre-line">
                {catechismAnswer}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
