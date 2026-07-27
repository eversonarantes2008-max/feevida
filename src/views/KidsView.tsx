import React, { useState, useRef, useEffect } from 'react';
import {
  Baby, Sparkles, Play, Volume2, VolumeX, CheckCircle2, RotateCcw,
  Award, BookOpen, Heart, Star, Palette, Trophy, Flame, ShieldCheck,
  Check, ArrowRight, RefreshCw, Sparkle
} from 'lucide-react';
import { KIDS_BIBLE_STORIES, KIDS_QUIZ_QUESTIONS } from '../data/kidsContent';
import { KidsStory } from '../types';

// Memory Match Game Cards for Saints and Holy Symbols
const MEMORY_CARDS_DATA = [
  { id: 'anjo', label: 'Anjo da Guarda', icon: '👼' },
  { id: 'cruz', label: 'Cruz Sagrada', icon: '✝️' },
  { id: 'biblia', label: 'Bíblia Sagrada', icon: '📖' },
  { id: 'pomba', label: 'Espírito Santo', icon: '🕊️' },
  { id: 'rosario', label: 'Santo Rosário', icon: '📿' },
  { id: 'coracao', label: 'Sagrado Coração', icon: '❤️' },
];

export const KidsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'games' | 'prayers' | 'drawing' | 'badges'>('stories');
  
  // Age filter
  const [selectedAge, setSelectedAge] = useState<'3-6' | '7-10' | '11+'>('3-6');
  const [selectedStory, setSelectedStory] = useState<KidsStory>(KIDS_BIBLE_STORIES[0]);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);

  // Custom AI Story Generator
  const [customTopic, setCustomTopic] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Games Subtabs
  const [gameSubtab, setGameSubtab] = useState<'puzzle' | 'quiz' | 'memory'>('puzzle');

  // Quiz Game State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Puzzle Game State (3x3 grid tiles)
  const [puzzleImage, setPuzzleImage] = useState<number>(0); // 0: Sagrada Familia, 1: Arca de Noe, 2: Nascimento
  const [puzzleTiles, setPuzzleTiles] = useState<number[]>([1, 4, 2, 0, 5, 3, 7, 6, 8]);
  const [puzzleMoves, setPuzzleMoves] = useState(0);
  const [puzzleWin, setPuzzleWin] = useState(false);

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState<Array<{ instanceId: number; id: string; label: string; icon: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMatches, setMemoryMatches] = useState(0);

  // Kids Prayers Selection
  const [selectedPrayer, setSelectedPrayer] = useState<'anjo' | 'painosso' | 'consagracao'>('anjo');
  const [isPlayingPrayerAudio, setIsPlayingPrayerAudio] = useState(false);

  // Canvas Sketching State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingColor, setDrawingColor] = useState('#D4AF37'); // Gold default
  const [brushSize, setBrushSize] = useState(6);
  const [isDrawing, setIsDrawing] = useState(false);

  // Badges Earned Counter
  const [badgesEarned, setBadgesEarned] = useState<{ story: boolean; quiz: boolean; puzzle: boolean; prayer: boolean }>({
    story: true,
    quiz: false,
    puzzle: false,
    prayer: false
  });

  const filteredStories = KIDS_BIBLE_STORIES.filter(s => s.ageGroup === selectedAge || selectedAge === '3-6');

  // Initialize Memory Match Game
  const startMemoryGame = () => {
    const duplicated = [...MEMORY_CARDS_DATA, ...MEMORY_CARDS_DATA].map((item, idx) => ({
      ...item,
      instanceId: idx,
      isFlipped: false,
      isMatched: false,
    }));
    // Shuffle
    const shuffled = duplicated.sort(() => Math.random() - 0.5);
    setMemoryCards(shuffled);
    setFlippedCards([]);
    setMemoryMatches(0);
  };

  useEffect(() => {
    startMemoryGame();
  }, []);

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  // Handle Speech Narration
  const handleSpeechNarration = (text: string, isPrayer = false) => {
    if ('speechSynthesis' in window) {
      if ((isPrayer && isPlayingPrayerAudio) || (!isPrayer && isPlayingNarration)) {
        window.speechSynthesis.cancel();
        setIsPlayingNarration(false);
        setIsPlayingPrayerAudio(false);
      } else {
        // Stop any active speech first
        window.speechSynthesis.cancel();

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9; // Soft kid-friendly speed

        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(v => v.lang.startsWith('pt') || v.lang.includes('BR') || v.lang.includes('PT'));
        if (ptVoice) {
          utterance.voice = ptVoice;
        }

        utterance.onstart = () => {
          if (isPrayer) {
            setIsPlayingPrayerAudio(true);
            setIsPlayingNarration(false);
          } else {
            setIsPlayingNarration(true);
            setIsPlayingPrayerAudio(false);
          }
        };

        utterance.onend = () => {
          setIsPlayingNarration(false);
          setIsPlayingPrayerAudio(false);
        };

        utterance.onerror = (e) => {
          console.warn('Speech error in KidsView:', e);
          setIsPlayingNarration(false);
          setIsPlayingPrayerAudio(false);
        };

        window.speechSynthesis.speak(utterance);
        if (isPrayer) {
          setIsPlayingPrayerAudio(true);
          setIsPlayingNarration(false);
        } else {
          setIsPlayingNarration(true);
          setIsPlayingPrayerAudio(false);
        }
      }
    } else {
      alert('Seu navegador não suporta leitura em áudio sintético.');
    }
  };

  // Generate Custom Story via Gemini API
  const handleGenerateCustomStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic) return;

    setIsGeneratingStory(true);
    try {
      const res = await fetch('/api/gemini/kids-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          ageGroup: selectedAge
        })
      });

      const data = await res.json();
      setIsGeneratingStory(false);
      if (data.story) {
        const generated: KidsStory = {
          id: `custom_${Date.now()}`,
          title: data.story.title || customTopic,
          subtitle: data.story.subtitle || 'História gerada para inspirar fé',
          ageGroup: selectedAge,
          moralLesson: data.story.moralLesson || 'Deus nos ama sempre e protege as crianças.',
          biblicalReference: data.story.biblicalReference || 'Bíblia Sagrada',
          imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=800',
          narratorAudioText: data.story.narratorAudioText || 'Era uma vez uma linda história de fé...',
          sections: data.story.sections || []
        };
        setSelectedStory(generated);
        setBadgesEarned(prev => ({ ...prev, story: true }));
      }
    } catch (err) {
      setIsGeneratingStory(false);
      alert('Erro ao gerar história. Tente novamente.');
    }
  };

  // Quiz Answer Handler
  const handleQuizAnswer = (optionIdx: number) => {
    setSelectedOption(optionIdx);
    if (optionIdx === KIDS_QUIZ_QUESTIONS[quizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (quizIndex + 1 < KIDS_QUIZ_QUESTIONS.length) {
        setQuizIndex(prev => prev + 1);
      } else {
        setQuizCompleted(true);
        setBadgesEarned(prev => ({ ...prev, quiz: true }));
      }
    }, 1400);
  };

  // Puzzle Handler
  const handleSwapPuzzleTile = (index: number) => {
    const emptyIdx = puzzleTiles.indexOf(8); // 8 is empty space
    const isAdjacent = Math.abs(index - emptyIdx) === 1 || Math.abs(index - emptyIdx) === 3;
    if (isAdjacent) {
      const newTiles = [...puzzleTiles];
      newTiles[emptyIdx] = newTiles[index];
      newTiles[index] = 8;
      setPuzzleTiles(newTiles);
      setPuzzleMoves(prev => prev + 1);

      const isSolved = newTiles.every((val, idx) => val === idx);
      if (isSolved) {
        setPuzzleWin(true);
        setBadgesEarned(prev => ({ ...prev, puzzle: true }));
      }
    }
  };

  // Memory Card Click
  const handleMemoryCardClick = (index: number) => {
    if (flippedCards.length === 2 || memoryCards[index].isFlipped || memoryCards[index].isMatched) return;

    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const first = newCards[newFlipped[0]];
      const second = newCards[newFlipped[1]];

      if (first.id === second.id) {
        // Match found!
        setTimeout(() => {
          newCards[newFlipped[0]].isMatched = true;
          newCards[newFlipped[1]].isMatched = true;
          setMemoryCards([...newCards]);
          setFlippedCards([]);
          setMemoryMatches(prev => {
            const updated = prev + 1;
            if (updated === MEMORY_CARDS_DATA.length) {
              setBadgesEarned(p => ({ ...p, puzzle: true }));
            }
            return updated;
          });
        }, 500);
      } else {
        // No match, flip back
        setTimeout(() => {
          newCards[newFlipped[0]].isFlipped = false;
          newCards[newFlipped[1]].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawingColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Fill canvas background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    if (activeTab === 'drawing' && canvasRef.current) {
      clearCanvas();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Kids Header Ribbon */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-amber-950 p-6 sm:p-8 rounded-3xl border-2 border-amber-300 shadow-xl text-center space-y-3 relative overflow-hidden">
        
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/50 border border-white/80 text-amber-950 text-xs font-bold uppercase tracking-wider">
          <Baby className="w-4 h-4 text-[#800020]" />
          <span>ESPAÇO INFANTIL FÉ E VIDA KIDS</span>
        </div>

        <h2 className="text-3xl sm:text-4xl serif font-extrabold tracking-wide text-amber-950">
          Aprenda a Palavra de Deus Brincando
        </h2>
        
        <p className="text-xs sm:text-sm font-semibold text-amber-900 max-w-xl mx-auto">
          Histórias bíblicas com áudio, jogos do conhecimento, orações infantis e espaço criativo para toda a família!
        </p>

        {/* Floating Badges Indicator */}
        <div className="pt-2 flex justify-center items-center space-x-3 text-xs font-bold">
          <span className="bg-white/80 px-3 py-1 rounded-full text-amber-950 border border-amber-200 flex items-center gap-1 shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Medalhas da Fé Conquistadas: {Object.values(badgesEarned).filter(Boolean).length}/4</span>
          </span>
        </div>
      </div>

      {/* Main Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 max-w-3xl mx-auto">
        {[
          { id: 'stories', label: '📖 Histórias Bíblicas', icon: BookOpen },
          { id: 'games', label: '🎮 Jogos da Fé', icon: Trophy },
          { id: 'prayers', label: '🕊️ Orações Infantis', icon: Heart },
          { id: 'drawing', label: '🎨 Colorir & Criar', icon: Palette },
          { id: 'badges', label: '🏅 Minhas Conquistas', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-[#002147] text-[#F1D592] border border-[#C5A059] shadow-md'
                : 'bg-white text-gray-700 hover:bg-amber-100/50 border border-gray-200'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: HISTÓRIAS BÍBLICAS */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          
          {/* Age Selector */}
          <div className="flex justify-center items-center space-x-2 bg-amber-50 p-2.5 rounded-2xl border border-amber-200 max-w-md mx-auto">
            <span className="text-xs font-bold text-[#002147] mr-2">Faixa Etária:</span>
            {[
              { id: '3-6', label: '3 a 6 anos' },
              { id: '7-10', label: '7 a 10 anos' },
              { id: '11+', label: '11+ anos' },
            ].map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAge(a.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedAge === a.id
                    ? 'bg-[#002147] text-[#F1D592] shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-slate-100'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* AI Generator Box */}
          <div className="p-4 bg-amber-100/80 rounded-2xl border border-amber-300 space-y-3 max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-800" />
              <h4 className="serif font-bold text-sm text-[#002147]">
                Criador Inteligente de Histórias Bíblicas
              </h4>
            </div>

            <form onSubmit={handleGenerateCustomStory} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Ex: A Ovelhinha Perdida, O Anjo da Guarda e as Estrelas..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
              <button
                type="submit"
                disabled={isGeneratingStory}
                className="px-5 py-2.5 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl hover:bg-[#002147]/90 transition shrink-0 border border-[#C5A059] uppercase tracking-wider"
              >
                {isGeneratingStory ? 'Criando...' : 'Criar História'}
              </button>
            </form>
          </div>

          {/* Story Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  selectedStory.id === story.id
                    ? 'border-[#C5A059] bg-amber-50 shadow-md ring-2 ring-[#C5A059]/40'
                    : 'border-gray-200 bg-white hover:bg-amber-50/40'
                }`}
              >
                <div>
                  <div className="h-32 rounded-xl overflow-hidden mb-2 relative">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-[#002147] text-[#F1D592] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C5A059]">
                      {story.ageGroup} anos
                    </span>
                  </div>
                  <h4 className="serif font-bold text-sm text-[#002147] line-clamp-1">{story.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{story.subtitle}</p>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-amber-900">
                  <span>{story.biblicalReference}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStory(story);
                      const fullText = `${story.title}. ${story.subtitle}. ${story.narratorAudioText}. ` +
                        (story.sections || []).map(s => `${s.heading}: ${s.text}`).join('. ');
                      handleSpeechNarration(fullText, false);
                    }}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Ouvir áudio →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Story Display */}
          <div className="bg-[#FDFCF0] p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059]/40 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#800020]">{selectedStory.biblicalReference}</span>
                <h3 className="text-2xl sm:text-3xl serif font-bold text-[#002147]">{selectedStory.title}</h3>
                <p className="text-xs text-gray-600 italic mt-0.5">{selectedStory.subtitle}</p>
              </div>

              <button
                onClick={() => {
                  const fullText = `${selectedStory.title}. ${selectedStory.subtitle}. ${selectedStory.narratorAudioText}. ` +
                    (selectedStory.sections || []).map(s => `${s.heading}: ${s.text}`).join('. ');
                  handleSpeechNarration(fullText, false);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  isPlayingNarration
                    ? 'bg-amber-500 text-amber-950 animate-pulse border border-amber-600 shadow-md'
                    : 'bg-[#002147] text-[#F1D592] hover:bg-[#002147]/90 border border-[#C5A059] shadow-md'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingNarration ? 'Parar Narração' : 'Ouvir Narração Completa'}</span>
              </button>
            </div>

            {/* Moral Lesson Banner */}
            <div className="p-4 bg-amber-100/80 rounded-2xl border border-amber-300 text-xs text-[#002147] font-bold space-y-1">
              <span className="uppercase tracking-wider text-[#800020] block">✨ Lição de Fé para as Crianças:</span>
              <p className="serif italic text-sm text-gray-800">{selectedStory.moralLesson}</p>
            </div>

            {/* Story Sections */}
            <div className="space-y-4">
              {selectedStory.sections?.map((sec, idx) => (
                <div key={idx} className="p-5 bg-white rounded-2xl border border-gray-200 space-y-2 shadow-sm">
                  <h4 className="serif font-bold text-base text-[#002147] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-[#800020] text-xs flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span>{sec.heading}</span>
                  </h4>
                  <p className="text-sm font-serif text-gray-800 leading-relaxed pl-8">{sec.text}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: JOGOS DA FÉ */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          
          {/* Game Subtab Selector */}
          <div className="flex justify-center space-x-2">
            {[
              { id: 'puzzle', label: '🧩 Quebra-Cabeça Sagrado' },
              { id: 'quiz', label: '🏆 Quiz Bíblico' },
              { id: 'memory', label: '🧠 Jogo da Memória dos Santos' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGameSubtab(g.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  gameSubtab === g.id
                    ? 'bg-[#002147] text-[#F1D592] border border-[#C5A059] shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Subgame 1: Quebra-Cabeça Sagrado */}
          {gameSubtab === 'puzzle' && (
            <div className="bg-[#FDFCF0] p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059]/40 shadow-xl text-center space-y-6 max-w-xl mx-auto">
              <div>
                <h3 className="text-2xl serif font-bold text-[#002147]">
                  Quebra-Cabeça da Sagrada Família
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Organize as peças numeradas de 1 a 8 para completar a imagem sagrada!
                </p>
              </div>

              {puzzleWin ? (
                <div className="p-6 bg-emerald-100 rounded-2xl border border-emerald-300 space-y-3">
                  <Award className="w-12 h-12 text-emerald-700 mx-auto" />
                  <h4 className="serif font-bold text-lg text-emerald-950">Parabéns! Você Conseguiu!</h4>
                  <p className="text-xs text-emerald-800">Completou em {puzzleMoves} movimentos. A Sagrada Família abençoa a sua jornada!</p>
                  <button
                    onClick={() => {
                      setPuzzleTiles([1, 4, 2, 0, 5, 3, 7, 6, 8]);
                      setPuzzleMoves(0);
                      setPuzzleWin(false);
                    }}
                    className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
                  >
                    Jogar Novamente
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-gray-500">
                    Movimentos Efetuados: <span className="text-[#800020] font-mono text-sm">{puzzleMoves}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-64 h-64 mx-auto p-2.5 bg-[#002147] rounded-2xl border-2 border-[#C5A059] shadow-inner">
                    {puzzleTiles.map((val, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSwapPuzzleTile(idx)}
                        className={`w-full h-full rounded-xl flex items-center justify-center font-serif font-bold text-xl transition ${
                          val === 8
                            ? 'bg-slate-800/60 border border-slate-700'
                            : 'gold-gradient text-[#002147] shadow-md border border-[#F1D592]'
                        }`}
                      >
                        {val === 8 ? '' : val + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setPuzzleTiles([1, 4, 2, 0, 5, 3, 7, 6, 8]);
                      setPuzzleMoves(0);
                    }}
                    className="text-xs text-gray-500 hover:text-[#002147] underline font-semibold"
                  >
                    Embaralhar Peças
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Subgame 2: Quiz Bíblico */}
          {gameSubtab === 'quiz' && (
            <div className="bg-[#FDFCF0] p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059]/40 shadow-xl space-y-6 max-w-xl mx-auto">
              {quizCompleted ? (
                <div className="text-center space-y-4 py-6">
                  <Award className="w-16 h-16 text-[#C5A059] mx-auto" />
                  <h3 className="text-2xl serif font-bold text-[#002147]">
                    Parabéns! Quiz Bíblico Concluído!
                  </h3>
                  <p className="text-sm font-semibold text-gray-700">
                    Você acertou <strong className="text-emerald-700 text-lg">{quizScore}</strong> de {KIDS_QUIZ_QUESTIONS.length} perguntas!
                  </p>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
                    🏅 Insígnia "Mestre do Quiz Bíblico" conquistada!
                  </div>
                  <button
                    onClick={() => {
                      setQuizIndex(0);
                      setQuizScore(0);
                      setQuizCompleted(false);
                    }}
                    className="px-6 py-2.5 gold-gradient text-[#002147] font-bold text-xs rounded-xl shadow-md border border-[#F1D592] uppercase tracking-wider"
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-xs font-bold uppercase text-[#800020]">
                      Pergunta {quizIndex + 1} de {KIDS_QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-xs font-bold text-gray-600">Pontuação: {quizScore}</span>
                  </div>

                  <h4 className="serif font-bold text-lg text-[#002147]">
                    {KIDS_QUIZ_QUESTIONS[quizIndex].question}
                  </h4>

                  <div className="space-y-2">
                    {KIDS_QUIZ_QUESTIONS[quizIndex].options.map((opt, idx) => {
                      const isCorrect = idx === KIDS_QUIZ_QUESTIONS[quizIndex].correctIndex;
                      const isSelected = selectedOption === idx;

                      let optionStyle = 'bg-white border-gray-200 text-gray-800 hover:bg-amber-50';
                      if (selectedOption !== null) {
                        if (isCorrect) optionStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                        else if (isSelected) optionStyle = 'bg-red-100 border-red-300 text-red-900';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={selectedOption !== null}
                          onClick={() => handleQuizAnswer(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition ${optionStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedOption !== null && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 italic">
                      💡 Explicação: {KIDS_QUIZ_QUESTIONS[quizIndex].explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subgame 3: Jogo da Memória */}
          {gameSubtab === 'memory' && (
            <div className="bg-[#FDFCF0] p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059]/40 shadow-xl space-y-6 max-w-xl mx-auto text-center">
              <div>
                <h3 className="text-2xl serif font-bold text-[#002147]">
                  Jogo da Memória dos Santos e Símbolos
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Encontre os pares iguais de Anjos, Bíblia, Espírito Santo e Símbolos Sagrados!
                </p>
              </div>

              {memoryMatches === MEMORY_CARDS_DATA.length ? (
                <div className="p-6 bg-emerald-100 rounded-2xl border border-emerald-300 space-y-3">
                  <Award className="w-12 h-12 text-emerald-700 mx-auto" />
                  <h4 className="serif font-bold text-lg text-emerald-950">Espetacular! Você Encontrou Todos os Pares!</h4>
                  <p className="text-xs text-emerald-800">Sua memória está abençoada!</p>
                  <button
                    onClick={startMemoryGame}
                    className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
                  >
                    Jogar Novamente
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {memoryCards.map((card, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMemoryCardClick(idx)}
                      className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition shadow-sm ${
                        card.isFlipped || card.isMatched
                          ? 'bg-white border-[#C5A059] text-gray-900'
                          : 'bg-[#002147] border-[#C5A059] text-[#F1D592]'
                      }`}
                    >
                      {card.isFlipped || card.isMatched ? (
                        <>
                          <span className="text-3xl">{card.icon}</span>
                          <span className="text-[10px] font-bold mt-1 text-[#002147] line-clamp-1">{card.label}</span>
                        </>
                      ) : (
                        <Sparkles className="w-6 h-6 text-[#C5A059]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB 3: ORAÇÕES INFANTIS */}
      {activeTab === 'prayers' && (
        <div className="bg-[#FDFCF0] p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059]/40 shadow-xl space-y-6 max-w-2xl mx-auto">
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl serif font-bold text-[#002147]">
              Minhas Orações para o Anjo da Guarda e Papai do Céu
            </h3>
            <p className="text-xs text-gray-600">
              Orações curtas, afetuosas e com áudio para rezar antes de dormir e ao acordar.
            </p>
          </div>

          <div className="flex justify-center space-x-2 border-b border-gray-200 pb-3">
            {[
              { id: 'anjo', label: '👼 Santo Anjo do Senhor' },
              { id: 'painosso', label: '✝️ Pai Nosso das Crianças' },
              { id: 'consagracao', label: '👑 Consagração a Maria' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPrayer(p.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  selectedPrayer === p.id
                    ? 'bg-[#002147] text-[#F1D592] border border-[#C5A059]'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Selected Prayer Content */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 space-y-5 text-center shadow-sm">
            
            {selectedPrayer === 'anjo' && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-[#002147] flex items-center justify-center mx-auto border border-[#C5A059]">
                  <span className="text-3xl">👼</span>
                </div>
                <h4 className="serif font-bold text-xl text-[#002147]">Oração ao Santo Anjo da Guarda</h4>
                <p className="text-base font-serif text-gray-800 leading-relaxed italic max-w-md mx-auto">
                  "Santo Anjo do Senhor, meu zeloso guardador,<br />
                  se a ti me confiou a piedade divina,<br />
                  sempre me rege, me guarda, me governa e me ilumina.<br />
                  Amém!"
                </p>
              </div>
            )}

            {selectedPrayer === 'painosso' && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-[#002147] flex items-center justify-center mx-auto border border-[#C5A059]">
                  <span className="text-3xl">✝️</span>
                </div>
                <h4 className="serif font-bold text-xl text-[#002147]">Pai Nosso das Crianças</h4>
                <p className="text-base font-serif text-gray-800 leading-relaxed italic max-w-md mx-auto">
                  "Pai Nosso que estais no céu, santificado seja o vosso nome.<br />
                  Venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu.<br />
                  O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas,<br />
                  assim como nós perdoamos a quem nos tem ofendido.<br />
                  E não nos deixeis cair em tentação, mas livrai-nos do mal.<br />
                  Amém!"
                </p>
              </div>
            )}

            {selectedPrayer === 'consagracao' && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-[#002147] flex items-center justify-center mx-auto border border-[#C5A059]">
                  <span className="text-3xl">👑</span>
                </div>
                <h4 className="serif font-bold text-xl text-[#002147]">Consagração a Nossa Senhora</h4>
                <p className="text-base font-serif text-gray-800 leading-relaxed italic max-w-md mx-auto">
                  "Ó minha Senhora, ó minha Mãe,<br />
                  eu me ofereço todo a vós e, em prova da minha devoção para convosco,<br />
                  vos consagro neste dia meus olhos, meus ouvidos, minha boca, meu coração e todo o meu ser.<br />
                  Guardai-me e defendei-me como coisa e propriedade vossa.<br />
                  Amém!"
                </p>
              </div>
            )}

            <button
              onClick={() => {
                const textToSpeak = selectedPrayer === 'anjo'
                  ? 'Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina. Amém!'
                  : selectedPrayer === 'painosso'
                  ? 'Pai Nosso que estais no céu, santificado seja o vosso nome. Venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu. Amém!'
                  : 'Ó minha Senhora, ó minha Mãe, eu me ofereço todo a vós. Guardai-me e defendei-me como filho vosso. Amém!';
                handleSpeechNarration(textToSpeak);
              }}
              className="px-6 py-3 bg-[#002147] text-[#F1D592] rounded-xl font-bold text-xs hover:bg-[#002147]/90 transition border border-[#C5A059] shadow-md flex items-center justify-center space-x-2 mx-auto uppercase tracking-wider"
            >
              <Volume2 className="w-4 h-4 text-[#C5A059]" />
              <span>Ouvir Oração em Voz Alta</span>
            </button>

          </div>

        </div>
      )}

      {/* TAB 4: COLORIR E CRIAR */}
      {activeTab === 'drawing' && (
        <div className="bg-[#FDFCF0] p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059]/40 shadow-xl space-y-6 max-w-2xl mx-auto text-center">
          
          <div>
            <h3 className="text-2xl serif font-bold text-[#002147]">
              Caderno de Desenhos e Símbolos Sagrados
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Escolha uma cor e desenhe cruzes, estrelas e anjinhos para homenagear a Deus!
            </p>
          </div>

          {/* Palette Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 bg-white p-3 rounded-2xl border border-gray-200">
            <span className="text-xs font-bold text-[#002147]">Cores:</span>
            {[
              { color: '#D4AF37', label: 'Dourado' },
              { color: '#002147', label: 'Azul' },
              { color: '#800020', label: 'Rubro' },
              { color: '#16a34a', label: 'Verde' },
              { color: '#9333ea', label: 'Roxo' },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() => setDrawingColor(c.color)}
                style={{ backgroundColor: c.color }}
                className={`w-7 h-7 rounded-full transition transform hover:scale-110 border-2 ${
                  drawingColor === c.color ? 'border-black ring-2 ring-amber-400' : 'border-white'
                }`}
                title={c.label}
              />
            ))}

            <div className="h-6 w-px bg-gray-200 mx-1" />

            <span className="text-xs font-bold text-[#002147]">Tamanho:</span>
            {[3, 6, 12].map((sz) => (
              <button
                key={sz}
                onClick={() => setBrushSize(sz)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  brushSize === sz ? 'bg-[#002147] text-[#F1D592] border-[#C5A059]' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {sz === 3 ? 'Fino' : sz === 6 ? 'Médio' : 'Grosso'}
              </button>
            ))}

            <button
              onClick={clearCanvas}
              className="px-3 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs font-bold rounded-lg transition"
            >
              Limpar Tela
            </button>
          </div>

          {/* Interactive Canvas */}
          <div className="relative mx-auto w-full max-w-lg h-80 bg-white rounded-2xl border-2 border-[#C5A059] shadow-inner overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={500}
              height={320}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full h-full touch-none"
            />
          </div>

        </div>
      )}

      {/* TAB 5: MINHAS CONQUISTAS */}
      {activeTab === 'badges' && (
        <div className="bg-[#FDFCF0] p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059]/40 shadow-xl space-y-6 max-w-2xl mx-auto text-center">
          
          <div>
            <h3 className="text-2xl serif font-bold text-[#002147]">
              Galeria de Medalhas da Fé
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Todas as insígnias e troféus que você ganhou aprendendo sobre Jesus!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className={`p-4 rounded-2xl border-2 transition ${
              badgesEarned.story
                ? 'bg-amber-50 border-[#C5A059] shadow-md'
                : 'bg-gray-100 border-gray-200 opacity-50'
            }`}>
              <div className="text-3xl mb-1">📖</div>
              <h4 className="serif font-bold text-xs text-[#002147]">Leitor Abençoado</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Leia 1 história bíblica</p>
              <span className="mt-2 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Conquistado
              </span>
            </div>

            <div className={`p-4 rounded-2xl border-2 transition ${
              badgesEarned.quiz
                ? 'bg-amber-50 border-[#C5A059] shadow-md'
                : 'bg-gray-100 border-gray-200 opacity-50'
            }`}>
              <div className="text-3xl mb-1">🏆</div>
              <h4 className="serif font-bold text-xs text-[#002147]">Mestre do Quiz</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Responda ao Quiz Bíblico</p>
              <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                badgesEarned.quiz ? 'text-emerald-700 bg-emerald-100' : 'text-gray-500 bg-gray-200'
              }`}>
                {badgesEarned.quiz ? 'Conquistado' : 'Pendente'}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border-2 transition ${
              badgesEarned.puzzle
                ? 'bg-amber-50 border-[#C5A059] shadow-md'
                : 'bg-gray-100 border-gray-200 opacity-50'
            }`}>
              <div className="text-3xl mb-1">🧩</div>
              <h4 className="serif font-bold text-xs text-[#002147]">Anjo do Quebra-Cabeça</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Monte a Sagrada Família</p>
              <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                badgesEarned.puzzle ? 'text-emerald-700 bg-emerald-100' : 'text-gray-500 bg-gray-200'
              }`}>
                {badgesEarned.puzzle ? 'Conquistado' : 'Pendente'}
              </span>
            </div>

            <div className={`p-4 rounded-2xl border-2 transition ${
              badgesEarned.prayer
                ? 'bg-amber-50 border-[#C5A059] shadow-md'
                : 'bg-gray-100 border-gray-200 opacity-50'
            }`}>
              <div className="text-3xl mb-1">👼</div>
              <h4 className="serif font-bold text-xs text-[#002147]">Amigo do Anjo</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Reze com o Anjo da Guarda</p>
              <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                badgesEarned.prayer ? 'text-emerald-700 bg-emerald-100' : 'text-gray-500 bg-gray-200'
              }`}>
                {badgesEarned.prayer ? 'Conquistado' : 'Pendente'}
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
