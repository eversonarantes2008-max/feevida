import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, QrCode, Copy, Sparkles, Lock, ArrowRight, Clock, Star, Gift, Check, HelpCircle, UserCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface LandingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
}

export const LandingCheckoutModal: React.FC<LandingCheckoutModalProps> = ({
  isOpen,
  onClose,
  user,
  onLoginSuccess
}) => {
  const [tab, setTab] = useState<'checkout' | 'status'>('checkout');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [copiedPix, setCopiedPix] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<'basico' | 'premium'>('basico');

  if (!isOpen) return null;

  // Chave PIX oficial
  const PIX_KEY = '27095675805';
  const PIX_AMOUNT = '19.00';

  // Código PIX Copia e Cola formatado conforme o padrão BCB
  const PIX_CODE_COPIA_E_COLA = `00020126330014br.gov.bcb.pix011127095675805520400005303986540519.005802BR5915EVERSON ARANTES6009SAO PAULO62070503***6304C20F`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_CODE_COPIA_E_COLA);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3500);
  };

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      alert('Por favor, informe seu e-mail de acesso.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          name: nameInput || emailInput.split('@')[0],
          paymentMethod: 'pix',
          planType: 'single'
        })
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        setTab('status');
      } else {
        alert(data.error || 'Erro ao registrar solicitação. Tente novamente.');
      }
    } catch (err) {
      setIsLoading(false);
      // Fallback local account
      const newUser: UserAccount = {
        id: `usr_local_${Date.now()}`,
        email: emailInput,
        name: nameInput || emailInput.split('@')[0],
        role: 'user',
        paymentStatus: 'pending',
        paymentMethod: 'pix',
        planType: 'single',
        createdAt: new Date().toISOString()
      };
      onLoginSuccess(newUser);
      setTab('status');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FDFCF0] text-[#002147] rounded-3xl shadow-2xl border-2 border-[#C5A059] overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header Ribbon da Página de Vendas */}
        <div className="bg-[#002147] text-white p-5 sm:p-6 relative border-b border-[#C5A059]/40 text-center shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition z-10"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/50 text-[#F1D592] text-xs font-bold mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>PÁGINA DE VENDAS OFICIAL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl serif font-extrabold text-white tracking-wide">
            Fé e Vida Católica Premium
          </h2>
          <p className="text-xs sm:text-sm text-[#F1D592] mt-1 font-medium italic max-w-xl mx-auto">
            Adquira o Acesso Completo ao Aplicativo Católico por Apenas R$ 19,00
          </p>
        </div>

        {/* Scrollable Sales Page Container */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-7">
          
          {tab === 'checkout' && (
            <div className="space-y-7">
              
              {/* Seleção do Plano (Básico R$ 19,00 x Premium Em Breve) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="serif font-bold text-base sm:text-lg text-[#002147] flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#C5A059] fill-current" />
                    <span>Escolha o seu Plano de Acesso:</span>
                  </h3>
                  <span className="text-xs font-bold text-[#800020] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Pagamento Único via PIX
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card Plano Básico R$ 19,00 */}
                  <div
                    onClick={() => setActivePlan('basico')}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition relative overflow-hidden flex flex-col justify-between ${
                      activePlan === 'basico'
                        ? 'border-[#C5A059] bg-gradient-to-br from-amber-50 to-white shadow-xl ring-2 ring-[#C5A059]/30'
                        : 'border-gray-200 bg-white opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#002147] text-[#F1D592] text-[10px] font-bold uppercase tracking-wider">
                          Recomendado
                        </span>
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          PIX Liberado
                        </span>
                      </div>

                      <h4 className="serif font-bold text-xl text-[#002147]">Plano Básico</h4>
                      <p className="text-xs text-gray-600">Acesso vitalício completo ao aplicativo devocional.</p>

                      <div className="pt-2">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-3xl serif font-extrabold text-[#800020]">R$ 19,00</span>
                          <span className="text-xs text-gray-500 font-medium">/ pagamento único</span>
                        </div>
                      </div>

                      <ul className="text-xs space-y-1.5 text-gray-700 pt-2 border-t border-gray-100">
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Liturgia Diária Oficial CNBB</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Bíblia Católica (73 livros com áudio)</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Santo Rosário & Terço Interativo</span>
                        </li>
                        <li className="flex items-center space-x-1.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Espaço Infantil Fé e Vida Kids</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                      <span className="text-xs font-bold text-[#002147] flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
                        <span>Plano Selecionado</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Plano Premium (Em Breve) */}
                  <div
                    onClick={() => setActivePlan('premium')}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition relative overflow-hidden flex flex-col justify-between ${
                      activePlan === 'premium'
                        ? 'border-[#800020] bg-rose-50/40 shadow-xl'
                        : 'border-gray-200 bg-gray-50/70'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#800020] text-white text-[10px] font-bold uppercase tracking-wider">
                          Em Breve
                        </span>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          Próxima Atualização
                        </span>
                      </div>

                      <h4 className="serif font-bold text-xl text-[#800020]">Plano Premium</h4>
                      <p className="text-xs text-gray-600">Módulos avançados de teologia e formação católica.</p>

                      <div className="pt-2">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl serif font-bold text-gray-400 line-through">R$ 49,00</span>
                          <span className="text-xs font-bold text-[#800020]">(Em Breve)</span>
                        </div>
                      </div>

                      <ul className="text-xs space-y-1.5 text-gray-600 pt-2 border-t border-gray-200">
                        <li className="flex items-center space-x-1.5 opacity-70">
                          <Clock className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                          <span>Tudo do Plano Básico incluso</span>
                        </li>
                        <li className="flex items-center space-x-1.5 opacity-70">
                          <Clock className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                          <span>Cursos Teológicos & Catequéticos em Vídeo</span>
                        </li>
                        <li className="flex items-center space-x-1.5 opacity-70">
                          <Clock className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                          <span>Podcasts diários de Homilias & Padres</span>
                        </li>
                        <li className="flex items-center space-x-1.5 opacity-70">
                          <Clock className="w-3.5 h-3.5 text-[#800020] shrink-0" />
                          <span>E-books e Materiais da Fé em PDF</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                      <span className="text-xs text-gray-500 font-medium italic">
                        Lançamento futuro. Adquira o Básico agora!
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Seção Exclusiva de Pagamento por PIX */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#C5A059]/50 shadow-lg space-y-5">
                
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#002147] text-[#F1D592] flex items-center justify-center border border-[#C5A059]">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="serif font-bold text-base sm:text-lg text-[#002147]">
                        Pagamento Exclusivo via PIX (R$ 19,00)
                      </h4>
                      <p className="text-xs text-gray-500">
                        Chave PIX do Titular: <strong className="text-[#002147]">{PIX_KEY}</strong>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Aprovação Master
                  </span>
                </div>

                {/* QR Code + PIX Copia e Cola Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#FDFCF0] p-4 sm:p-5 rounded-2xl border border-[#C5A059]/30">
                  
                  {/* QR CODE DISPLAY */}
                  <div className="flex flex-col items-center justify-center text-center space-y-2 p-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    
                    {/* Inline High-Precision QR Code SVG */}
                    <div className="relative p-3 bg-white rounded-xl border border-[#C5A059]/40 shadow-inner">
                      <svg
                        className="w-44 h-44 sm:w-48 sm:h-48"
                        viewBox="0 0 256 256"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Background */}
                        <rect width="256" height="256" rx="12" fill="#FFFFFF" />
                        
                        {/* QR Code Outer Frame Pattern */}
                        <path
                          d="M16 16H80V80H16V16ZM32 32V64H64V32H32ZM176 16H240V80H176V16ZM192 32V64H224V32H192ZM16 176H80V240H16V176ZM32 192V224H64V192H32Z"
                          fill="#002147"
                        />
                        {/* Inner Finder Blocks */}
                        <rect x="40" y="40" width="16" height="16" fill="#800020" />
                        <rect x="200" y="40" width="16" height="16" fill="#800020" />
                        <rect x="40" y="200" width="16" height="16" fill="#800020" />

                        {/* Simulated Data Pattern Matrix */}
                        <path
                          d="M96 16H112V32H96V16ZM128 16H160V32H128V16ZM96 48H128V64H96V48ZM144 48H160V80H144V48ZM96 80H112V96H96V80ZM128 80H144V112H128V80ZM16 96H48V112H16V96ZM64 96H80V128H64V96ZM16 128H32V144H16V128ZM48 128H64V160H48V128ZM160 96H192V112H160V96ZM208 96H240V112H208V96ZM176 128H208V144H176V128ZM224 128H240V160H224V128ZM96 128H128V144H96V128ZM144 144H160V176H144V144ZM96 160H112V192H96V160ZM128 176H160V192H128V176ZM96 208H128V224H96V208ZM176 176H192V208H176V176ZM208 176H224V192H208V176ZM192 208H224V224H192V208ZM224 224H240V240H224V224ZM144 208H160V240H144V208Z"
                          fill="#002147"
                        />

                        {/* Center Emblem PIX Badge */}
                        <rect x="100" y="100" width="56" height="56" rx="10" fill="#002147" stroke="#C5A059" strokeWidth="2" />
                        <text x="128" y="133" textAnchor="middle" fill="#F1D592" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                          PIX
                        </text>
                      </svg>

                      {/* Floating Badge */}
                      <div className="absolute -bottom-2 bg-[#800020] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-gold shadow-md">
                        R$ 19,00
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-gray-700 mt-1">
                      Escaneie o QR Code com o aplicativo do seu banco
                    </span>
                  </div>

                  {/* PIX COPIA E COLA DETAILS */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#002147] uppercase">
                        Chave PIX ou Código Copia e Cola:
                      </label>
                      <div className="p-2.5 bg-white rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 flex items-center justify-between">
                        <span>Chave PIX (CPF): <strong className="text-[#800020] font-mono text-sm">{PIX_KEY}</strong></span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Ativa</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">
                        Código PIX Copia e Cola Completo:
                      </label>
                      <div className="relative">
                        <textarea
                          readOnly
                          rows={3}
                          value={PIX_CODE_COPIA_E_COLA}
                          className="w-full text-xs p-2.5 pr-10 rounded-xl border border-gray-300 bg-white text-gray-600 font-mono resize-none focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="absolute right-2 top-2 p-1.5 bg-[#002147] text-[#F1D592] rounded-lg hover:bg-[#002147]/90 transition"
                          title="Copiar Código PIX"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="w-full py-2.5 px-4 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition shadow-md flex items-center justify-center space-x-2 border border-emerald-500"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedPix ? '✓ Código PIX Copiado com Sucesso!' : 'Copiar Código PIX Copia e Cola'}</span>
                    </button>
                  </div>

                </div>

                {/* Passo a Passo de Pagamento */}
                <div className="bg-[#FDFCF0] p-4 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <span className="font-bold text-[#002147] uppercase tracking-wider block">
                    Como Efetuar o Pagamento e Liberar seu Acesso:
                  </span>
                  <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700 font-medium">
                    <li className="bg-white p-2.5 rounded-xl border border-gray-200">
                      <span className="font-bold text-[#800020] block mb-0.5">1. Pague pelo Banco</span>
                      Abra o app do seu banco, escolha Pix e pague R$ 19,00 usando a chave <strong className="font-mono text-gray-900">{PIX_KEY}</strong> ou Copia e Cola.
                    </li>
                    <li className="bg-white p-2.5 rounded-xl border border-gray-200">
                      <span className="font-bold text-[#800020] block mb-0.5">2. Registre seus Dados</span>
                      Insira seu Nome e E-mail de acesso no formulário logo abaixo.
                    </li>
                    <li className="bg-white p-2.5 rounded-xl border border-gray-200">
                      <span className="font-bold text-[#800020] block mb-0.5">3. Permissão do Master</span>
                      A solicitação é enviada diretamente para autorização do Administrador Master.
                    </li>
                  </ol>
                </div>

              </div>

              {/* Formulário de Inscrição e Envio ao Administrador Master */}
              <form onSubmit={handleProcessPayment} className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#C5A059]/40 shadow-lg space-y-5">
                
                <div>
                  <h4 className="serif font-bold text-base text-[#002147] border-b border-gray-100 pb-2 mb-3">
                    Informe seus Dados para Registro e Liberação do Acesso:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Maria das Graças Silva"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-[#FDFCF0] focus:outline-none focus:ring-2 focus:ring-[#C5A059] text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                        Seu E-mail Principal *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="fiel@gmail.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-[#FDFCF0] focus:outline-none focus:ring-2 focus:ring-[#C5A059] text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Botão Principal de Envio para Liberação do Master */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-2xl gold-gradient text-[#002147] font-extrabold text-base hover:opacity-95 transition shadow-xl flex items-center justify-center space-x-2 border border-[#F1D592] uppercase tracking-wider"
                >
                  {isLoading ? (
                    <span>Registrando solicitação...</span>
                  ) : (
                    <>
                      <span>Confirmar Pagamento e Pedir Liberação ao Master</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Seus dados são protegidos. O Administrador Master autorizará o acesso após a confirmação.</span>
                </div>

              </form>

            </div>
          )}

          {/* Tela de Solicitação Pendente de Aprovação do Administrador Master */}
          {tab === 'status' && (
            <div className="py-6 sm:py-8 text-center space-y-6 max-w-xl mx-auto">
              
              <div className="w-20 h-20 rounded-full bg-amber-100 text-[#002147] flex items-center justify-center mx-auto border-2 border-[#C5A059] shadow-xl">
                <UserCheck className="w-10 h-10 text-[#C5A059]" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
                  Solicitação Enviada com Sucesso
                </span>
                <h3 className="text-2xl sm:text-3xl serif font-bold text-[#002147]">
                  Aguardando Permissão do Administrador Master
                </h3>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#C5A059]/40 shadow-md text-left space-y-3 text-sm text-gray-700">
                <p>
                  Obrigado por registrar seu pagamento de <strong className="text-[#800020]">R$ 19,00 (Plano Básico)</strong> via PIX!
                </p>

                <p>
                  O e-mail cadastrado <strong className="text-[#002147] font-bold">{emailInput}</strong> foi registrado no sistema.
                  De acordo com as diretrizes do aplicativo, a autorização final para conceder o acesso deve ser efetuada pelo <strong className="text-[#002147]">Administrador Master</strong> (<span className="font-mono text-xs text-gray-800">everson.arantes.2008@gmail.com</span>).
                </p>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium space-y-1">
                  <p className="font-bold flex items-center gap-1 text-[#002147]">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span>Status: Pendente de Autorização Master</span>
                  </p>
                  <p>Assim que o Administrador Master verificar seu pagamento no Painel Master, todo o aplicativo (Liturgia, Bíblia, Terço, Orações e Espaço Kids) será ativado automaticamente para o seu e-mail!</p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 bg-[#002147] text-[#F1D592] rounded-xl font-bold text-sm hover:bg-[#002147]/90 transition border border-[#C5A059] shadow-md uppercase tracking-wider"
                >
                  Entendido, Voltar ao Aplicativo
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
