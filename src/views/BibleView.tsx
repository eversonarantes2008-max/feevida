import React, { useState } from 'react';
import { Search, Bookmark, Plus, Check, BookOpen, Share2, Volume2, VolumeX, Sun, Moon, Type, ChevronLeft, ChevronRight, Maximize2, Minimize2, Settings2, Sliders } from 'lucide-react';
import { CATHOLIC_BIBLE_BOOKS, SAMPLE_BIBLE_VERSES } from '../data/catholicBible';
import { BibleBook, HighlightedVerse } from '../types';

type ReadingTheme = 'pergaminho' | 'sepia' | 'noite' | 'branco';
type FontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl';
type LineHeight = 'normal' | 'relaxed' | 'loose';

export const BibleView: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BibleBook>(CATHOLIC_BIBLE_BOOKS[0]);
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'old' | 'new'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [highlights, setHighlights] = useState<HighlightedVerse[]>([]);
  const [selectedHighlightColor, setSelectedHighlightColor] = useState<'gold' | 'wine' | 'blue' | 'emerald'>('gold');

  // Modo Leitura State
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('pergaminho');
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [lineHeight, setLineHeight] = useState<LineHeight>('relaxed');
  const [fontFamily, setFontFamily] = useState<'garamond' | 'serif' | 'sans'>('garamond');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const filteredBooks = CATHOLIC_BIBLE_BOOKS.filter(b => {
    if (testamentFilter === 'old') return b.testament === 'old';
    if (testamentFilter === 'new') return b.testament === 'new';
    return true;
  });

  const currentVerses = SAMPLE_BIBLE_VERSES[selectedBook.id]?.[selectedChapter] || [
    { bookId: selectedBook.id, chapter: selectedChapter, verse: 1, text: `Capítulo ${selectedChapter} de ${selectedBook.name}.` },
    { bookId: selectedBook.id, chapter: selectedChapter, verse: 2, text: 'No princípio era a Palavra, e a Palavra estava junto de Deus, e a Palavra era Deus.' },
    { bookId: selectedBook.id, chapter: selectedChapter, verse: 3, text: 'Tudo foi feito por meio dela, e sem ela nada do que foi feito se fez.' },
    { bookId: selectedBook.id, chapter: selectedChapter, verse: 4, text: 'Nela estava a vida, e a vida era a luz dos homens; a luz brilha nas trevas.' },
    { bookId: selectedBook.id, chapter: selectedChapter, verse: 5, text: 'Graças e louvores se dêem a todo o momento, ao Santíssimo e Digníssimo Sacramento.' }
  ];

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else {
      const currentIdx = CATHOLIC_BIBLE_BOOKS.findIndex(b => b.id === selectedBook.id);
      if (currentIdx > 0) {
        const prevBook = CATHOLIC_BIBLE_BOOKS[currentIdx - 1];
        setSelectedBook(prevBook);
        setSelectedChapter(prevBook.chaptersCount);
      }
    }
  };

  const handleNextChapter = () => {
    if (selectedChapter < selectedBook.chaptersCount) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      const currentIdx = CATHOLIC_BIBLE_BOOKS.findIndex(b => b.id === selectedBook.id);
      if (currentIdx < CATHOLIC_BIBLE_BOOKS.length - 1) {
        const nextBook = CATHOLIC_BIBLE_BOOKS[currentIdx + 1];
        setSelectedBook(nextBook);
        setSelectedChapter(1);
      }
    }
  };

  const handleToggleHighlight = (verseNum: number, text: string) => {
    const existingIndex = highlights.findIndex(
      h => h.bookId === selectedBook.id && h.chapter === selectedChapter && h.verse === verseNum
    );

    if (existingIndex >= 0) {
      setHighlights(highlights.filter((_, idx) => idx !== existingIndex));
    } else {
      setHighlights([
        ...highlights,
        {
          id: `hl_${Date.now()}_${verseNum}`,
          bookId: selectedBook.id,
          chapter: selectedChapter,
          verse: verseNum,
          text,
          color: selectedHighlightColor,
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleReadChapterAloud = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const fullText = `${selectedBook.name}, Capítulo ${selectedChapter}. ` + currentVerses.map(v => `${v.verse}. ${v.text}`).join(' ');
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  const isVerseHighlighted = (verseNum: number) => {
    return highlights.find(
      h => h.bookId === selectedBook.id && h.chapter === selectedChapter && h.verse === verseNum
    );
  };

  // Theme styling mapping
  const themeStyles = {
    pergaminho: {
      bg: 'bg-[#FDFCF0]',
      text: 'text-[#002147]',
      border: 'border-[#C5A059]/40',
      verseNum: 'text-[#800020]',
      box: 'bg-white/80 border-[#C5A059]/30'
    },
    sepia: {
      bg: 'bg-[#F5EFE0]',
      text: 'text-[#3E2723]',
      border: 'border-[#8D6E63]/40',
      verseNum: 'text-[#5D4037]',
      box: 'bg-[#EFE6D5] border-[#8D6E63]/30'
    },
    noite: {
      bg: 'bg-[#0B132B]',
      text: 'text-[#E0E6ED]',
      border: 'border-[#C5A059]/30',
      verseNum: 'text-[#F1D592]',
      box: 'bg-[#1C2541] border-[#C5A059]/20'
    },
    branco: {
      bg: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200',
      verseNum: 'text-[#800020]',
      box: 'bg-gray-50 border-gray-200'
    }
  };

  const currentTheme = themeStyles[readingTheme];

  const fontSizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const lineHeightClasses = {
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  };

  const fontFamilyClasses = {
    garamond: 'font-garamond',
    serif: 'serif',
    sans: 'font-sans'
  };

  return (
    <div className={`space-y-6 pb-12 transition-colors duration-300 ${isFocusMode ? 'fixed inset-0 z-50 overflow-y-auto p-4 sm:p-8 ' + currentTheme.bg : ''}`}>
      
      {/* Header (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <div className="bg-[#002147] text-white p-6 rounded-2xl border border-[#C5A059] shadow-xl text-center space-y-2 relative overflow-hidden">
          <div className="texture-overlay"></div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#F1D592] text-xs font-bold uppercase tracking-wider">
            Cânone Oficial da CNBB (73 Livros)
          </span>
          <h2 className="text-2xl sm:text-3xl serif font-bold text-gold">
            Bíblia Sagrada Católica
          </h2>
          <p className="text-xs text-gray-300 font-medium max-w-xl mx-auto">
            Com todos os 46 livros do Antigo Testamento (incluindo os Deuterocanônicos) e 27 do Novo Testamento
          </p>
        </div>
      )}

      {/* Book & Chapter Selection Controls (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#C5A059]/30 shadow-md space-y-4">
          
          {/* Testament Switcher */}
          <div className="flex justify-center space-x-2 border-b border-gray-200 pb-3">
            {[
              { id: 'all', label: 'Todos os 73 Livros' },
              { id: 'old', label: 'Antigo Testamento (46)' },
              { id: 'new', label: 'Novo Testamento (27)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTestamentFilter(t.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  testamentFilter === t.id
                    ? 'bg-[#002147] text-[#F1D592] border border-[#C5A059]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Book Dropdown & Chapter Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                Selecione o Livro Sagrado:
              </label>
              <select
                value={selectedBook.id}
                onChange={(e) => {
                  const book = CATHOLIC_BIBLE_BOOKS.find(b => b.id === e.target.value);
                  if (book) {
                    setSelectedBook(book);
                    setSelectedChapter(1);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-bold text-sm focus:ring-2 focus:ring-[#C5A059]"
              >
                {filteredBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.abbreviation}) - {b.chaptersCount} cap.
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                Selecione o Capítulo:
              </label>
              <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-thin">
                {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChapter(ch)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition shrink-0 flex items-center justify-center border ${
                      selectedChapter === ch
                        ? 'bg-[#800020] text-white border-gold shadow-md scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODO LEITURA BÍBLICA TOOLBAR */}
      <div className={`${currentTheme.box} p-4 rounded-2xl border shadow-md space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002147] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#C5A059]" /> Modo Leitura
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Audio Speech Synthesis Button */}
            <button
              onClick={handleReadChapterAloud}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                isPlayingAudio
                  ? 'bg-[#C5A059] text-[#002147] animate-pulse border border-[#002147]'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>{isPlayingAudio ? 'Parar Leitura' : 'Ouvir Capítulo'}</span>
            </button>

            {/* Toggle Settings Modal/Bar */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 flex items-center space-x-1"
            >
              <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Aparência</span>
            </button>

            {/* Focus / Fullscreen Mode Toggle */}
            <button
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#002147] text-[#F1D592] border border-[#C5A059] hover:bg-[#002147]/90 flex items-center space-x-1"
            >
              {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-[#C5A059]" />}
              <span>{isFocusMode ? 'Sair do Modo Foco' : 'Modo Foco Meditativo'}</span>
            </button>

          </div>
        </div>

        {/* Reading Settings Drawer */}
        {showSettings && (
          <div className="pt-3 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            {/* Reading Themes */}
            <div>
              <span className="font-bold text-gray-700 block mb-1.5">Tema de Leitura:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'pergaminho', label: 'Creme', bg: 'bg-[#FDFCF0] text-[#002147] border-[#C5A059]' },
                  { id: 'sepia', label: 'Sépia', bg: 'bg-[#F5EFE0] text-[#3E2723] border-[#8D6E63]' },
                  { id: 'noite', label: 'Noite', bg: 'bg-[#0B132B] text-[#E0E6ED] border-gray-600' },
                  { id: 'branco', label: 'Claro', bg: 'bg-white text-gray-900 border-gray-300' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setReadingTheme(t.id as any)}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border text-center transition ${t.bg} ${
                      readingTheme === t.id ? 'ring-2 ring-[#002147] shadow-sm scale-105' : 'opacity-80'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Sizes */}
            <div>
              <span className="font-bold text-gray-700 block mb-1.5">Tamanho do Texto:</span>
              <div className="flex space-x-1">
                {[
                  { id: 'sm', label: 'P' },
                  { id: 'base', label: 'M' },
                  { id: 'lg', label: 'G' },
                  { id: 'xl', label: 'GG' },
                  { id: '2xl', label: 'MAX' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontSize(f.id as any)}
                    className={`flex-1 py-1.5 rounded-lg border font-bold text-center transition ${
                      fontSize === f.id
                        ? 'bg-[#002147] text-[#F1D592] border-[#C5A059]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Height & Font Style */}
            <div>
              <span className="font-bold text-gray-700 block mb-1.5">Espaçamento & Fonte:</span>
              <div className="flex gap-2">
                <select
                  value={lineHeight}
                  onChange={(e) => setLineHeight(e.target.value as any)}
                  className="flex-1 py-1 px-2 rounded-lg border border-gray-300 bg-white font-bold text-xs"
                >
                  <option value="normal">Normal</option>
                  <option value="relaxed">Confortável</option>
                  <option value="loose">Expandido</option>
                </select>

                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="flex-1 py-1 px-2 rounded-lg border border-gray-300 bg-white font-bold text-xs"
                >
                  <option value="garamond">Garamond Clássica</option>
                  <option value="serif">Serif Sacra</option>
                  <option value="sans">Sans Legível</option>
                </select>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Scripture Reader Display Canvas */}
      <div className={`${currentTheme.bg} ${currentTheme.text} p-6 sm:p-10 rounded-3xl border ${currentTheme.border} shadow-2xl space-y-8 transition-all duration-300`}>
        
        {/* Chapter Header */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 ${currentTheme.border}`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              {selectedBook.category} • {selectedBook.testament === 'old' ? 'Antigo Testamento' : 'Novo Testamento'}
            </span>
            <h3 className="text-2xl sm:text-3xl serif font-bold tracking-tight mt-0.5">
              {selectedBook.name} — Capítulo {selectedChapter}
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevChapter}
              className="p-2 rounded-xl bg-black/5 hover:bg-black/10 transition"
              title="Capítulo Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold opacity-80">
              {selectedChapter} / {selectedBook.chaptersCount}
            </span>
            <button
              onClick={handleNextChapter}
              className="p-2 rounded-xl bg-black/5 hover:bg-black/10 transition"
              title="Próximo Capítulo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verses Reading Block */}
        <div className={`space-y-4 ${fontSizeClasses[fontSize]} ${lineHeightClasses[lineHeight]} ${fontFamilyClasses[fontFamily]}`}>
          {currentVerses.map((verse) => {
            const hl = isVerseHighlighted(verse.verse);
            let hlClass = '';
            if (hl) {
              if (hl.color === 'gold') hlClass = 'bg-amber-200/60 dark:bg-amber-900/40 border-l-4 border-amber-500 p-2 rounded-r-lg';
              if (hl.color === 'wine') hlClass = 'bg-rose-200/60 dark:bg-rose-900/40 border-l-4 border-rose-500 p-2 rounded-r-lg';
              if (hl.color === 'blue') hlClass = 'bg-sky-200/60 dark:bg-sky-900/40 border-l-4 border-sky-500 p-2 rounded-r-lg';
              if (hl.color === 'emerald') hlClass = 'bg-emerald-200/60 dark:bg-emerald-900/40 border-l-4 border-emerald-500 p-2 rounded-r-lg';
            }

            return (
              <div
                key={verse.verse}
                onClick={() => handleToggleHighlight(verse.verse, verse.text)}
                className={`cursor-pointer transition hover:bg-black/5 p-1 rounded-lg ${hlClass}`}
              >
                <sup className={`font-bold text-xs mr-2 font-sans select-none ${currentTheme.verseNum}`}>
                  {verse.verse}
                </sup>
                <span>{verse.text}</span>
              </div>
            );
          })}
        </div>

        {/* Floating Chapter Navigation Footer */}
        <div className={`pt-6 border-t ${currentTheme.border} flex items-center justify-between`}>
          <button
            onClick={handlePrevChapter}
            className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition text-xs font-bold flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Capítulo Anterior</span>
          </button>

          <span className="text-xs italic opacity-70 hidden sm:inline">
            Clique no versículo para grifar e salvar
          </span>

          <button
            onClick={handleNextChapter}
            className="px-4 py-2 rounded-xl bg-black/5 hover:bg-black/10 transition text-xs font-bold flex items-center space-x-1"
          >
            <span>Próximo Capítulo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

