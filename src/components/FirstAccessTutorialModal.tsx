import React, { useState } from 'react';
import {
  X, Cross, BookOpen, HeartHandshake, Sparkles, Smartphone, ArrowRight,
  ArrowLeft, CheckCircle2, Volume2, ShieldCheck, HelpCircle, Download
} from 'lucide-react';

interface FirstAccessTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
  onInstallPwa?: () => void;
}

export const FirstAccessTutorialModal: React.FC<FirstAccessTutorialModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onInstallPwa
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem('fe_vida_tutorial_dismissed', 'true');
    }
    onClose();
  };

  const steps = [
    {
      title: 'Boas-Vindas ao Fé e Vida Católica',
      subtitle: 'Seu Santuário Digital de Oração e Formação Diária',
      icon: Cross,
      color: 'from-[#002147] to-[#003366]',
      content: (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-[#002147] shadow-lg mx-auto border-2 border-[#F1D592]">
            <Cross className="w-8 h-8 stroke-[2.5]" />
          </div>
          <p className="text-xs text-gray-700 leading-relaxed max-w-md mx-auto">
            Seja muito bem-vindo! O aplicativo <strong>Fé e Vida Católica</strong> foi cuidadosamente preparado para auxiliar seu crescimento espiritual todos os dias, reunindo em um só lugar a Liturgia Sagrada da Igreja, a Bíblia completa, as orações tradicionais e auxílio da inteligência católica.
          </p>
          <div className="grid grid-cols-2 gap-2 text-left pt-2">
            <div className="p-3 bg-white border border-[#C5A059]/30 rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold text-[#002147]">100% Católico e Aprovado</span>
            </div>
            <div className="p-3 bg-white border border-[#C5A059]/30 rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold text-[#002147]">Sem Anúncios Intrusivos</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '1. Liturgia Diária & Santo do Dia',
      subtitle: 'Alimente sua alma com as Leituras Oficiais do Dia',
      icon: BookOpen,
      color: 'from-amber-900 to-[#800020]',
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-[#002147] text-[#F1D592] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#002147]">Primeira Leitura, Salmo & Evangelho</p>
              <p className="text-gray-600 text-[11px] leading-snug">
                Acompanhe diariamente as leituras da missa segundo o calendário litúrgico oficial da CNBB.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-800 text-amber-100 shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#002147]">Reflexão Diária falada por IA</p>
              <p className="text-gray-600 text-[11px] leading-snug">
                Ouça o comentário em áudio do Evangelho enquanto faz sua caminhada ou meditação matinal.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-rose-900 text-rose-100 shrink-0">
              <Cross className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#002147]">Biografia do Santo do Dia</p>
              <p className="text-gray-600 text-[11px] leading-snug">
                Conheça a história inspiradora, virtudes e a oração oficial do santo comemorado na data.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '2. Bíblia Sagrada Ave Maria',
      subtitle: 'Todos os 73 Livros do Antigo e Novo Testamento',
      icon: BookOpen,
      color: 'from-emerald-900 to-teal-900',
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-gray-700 leading-relaxed text-center">
            Acesse a Palavra de Deus completa na tradução clássica <strong>Ave Maria</strong>, dividida por capítulos e versículos de fácil leitura.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <p className="font-bold text-emerald-950 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Busca Inteligente</span>
              </p>
              <p className="text-emerald-900 text-[11px]">
                Encontre passagens, salmos e parábolas pelo nome do livro ou número do capítulo.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <p className="font-bold text-emerald-950 flex items-center space-x-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Leitura em Áudio</span>
              </p>
              <p className="text-emerald-900 text-[11px]">
                Escute capítulos inteiros narrados com voz suave e agradável no seu celular.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '3. Santo Terço & Catecismo com IA',
      subtitle: 'Oração com Áudio e Respostas Teológicas Instantâneas',
      icon: HeartHandshake,
      color: 'from-purple-900 to-indigo-900',
      content: (
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-purple-900 text-purple-100 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-purple-950">Santo Terço Interativo & Guiado</p>
              <p className="text-purple-900 text-[11px] leading-snug">
                Contador de mistérios do dia (Gozosos, Dolorosos, Gloriosos e Luminosos) com narração em áudio das orações.
              </p>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-indigo-900 text-indigo-100 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-indigo-950">Assistente Teológico Católica (IA)</p>
              <p className="text-indigo-900 text-[11px] leading-snug">
                Tire dúvidas doutrinárias baseadas no Catecismo da Igreja Católica, Doutrina Social e encíclicas dos Papas.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '4. Como Instalar no Celular (App PWA)',
      subtitle: 'Acesse como um aplicativo nativo no seu Android ou iPhone',
      icon: Smartphone,
      color: 'from-[#002147] to-[#800020]',
      content: (
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <p className="font-bold text-[#002147] flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-[#800020]" />
              <span>Instalação Grátis na Tela de Início</span>
            </p>
            <p className="text-gray-700 text-[11px] leading-relaxed">
              Você pode adicionar o ícone do <strong>Fé e Vida Católica</strong> diretamente na tela inicial do seu celular, sem ocupar espaço na memória!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
              <p className="font-bold text-[#002147] text-[11px]">📱 No Android (Chrome):</p>
              <p className="text-gray-600 text-[10px] leading-snug">
                1. Toque nos 3 pontinhos do navegador.<br />
                2. Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
              </p>
            </div>

            <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
              <p className="font-bold text-[#002147] text-[11px]">🍏 No iPhone (Safari):</p>
              <p className="text-gray-600 text-[10px] leading-snug">
                1. Toque no ícone de <strong>Compartilhar</strong> (quadrado com seta).<br />
                2. Selecione <strong>"Adicionar à Tela de Início"</strong>.
              </p>
            </div>
          </div>

          {onInstallPwa && (
            <button
              onClick={onInstallPwa}
              className="w-full py-2.5 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 hover:bg-[#002147]/90 transition border border-[#C5A059]"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>Instalar Aplicativo Agora</span>
            </button>
          )}
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#FDFCF0] border-2 border-[#C5A059] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header Banner */}
        <div className={`p-6 bg-gradient-to-r ${currentStepData.color} text-white relative flex flex-col items-center justify-center text-center shrink-0`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            title="Fechar tutorial"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-2">
            <currentStepData.icon className="w-5 h-5 text-[#F1D592]" />
          </div>

          <h2 className="serif font-extrabold text-lg sm:text-xl text-white">
            {currentStepData.title}
          </h2>
          <p className="text-xs text-[#F1D592] font-medium mt-0.5 max-w-xs">
            {currentStepData.subtitle}
          </p>

          {/* Step indicator dots */}
          <div className="flex items-center space-x-1.5 mt-3">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-[#F1D592]' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {currentStepData.content}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 space-y-3">
          
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-[11px] text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 text-[#002147] rounded border-gray-300 focus:ring-[#C5A059]"
              />
              <span>Não mostrar este tutorial na próxima abertura</span>
            </label>

            <span className="text-[11px] font-bold text-gray-400">
              Passo {currentStep + 1} de {steps.length}
            </span>
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="w-1/3 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className={`${currentStep === 0 ? 'w-full' : 'w-2/3'} py-2.5 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 uppercase tracking-wider`}
              >
                <span>Próximo Passo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 uppercase tracking-wider"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F1D592]" />
                <span>Concluir Guia & Começar</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
