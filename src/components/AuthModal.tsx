import React, { useState, useEffect } from 'react';
import {
  X, Cross, Mail, Lock, User, Phone, CheckCircle2, ShieldCheck, Sparkles,
  ArrowRight, Key, Eye, EyeOff, AlertCircle, LogOut, Check, Shield,
  Receipt, Printer, FileText, CreditCard, RefreshCw
} from 'lucide-react';
import { UserAccount, PaymentTransaction } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onLoginSuccess: (user: UserAccount) => void;
  onOpenCheckout?: () => void;
  user: UserAccount | null;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onLoginSuccess,
  onOpenCheckout,
  user,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile'>(
    user ? 'profile' : initialTab
  );

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Forgot Password State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Payment History & Receipt state
  const [userPayments, setUserPayments] = useState<PaymentTransaction[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  useEffect(() => {
    if (user && user.email) {
      setLoadingPayments(true);
      fetch(`/api/user/payments?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.payments) {
            setUserPayments(data.payments);
          }
          setLoadingPayments(false);
        })
        .catch(() => setLoadingPayments(false));
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        setSuccessMessage('Login efetuado com sucesso!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMessage(data.error || 'Não foi possível efetuar o login. Verifique seus dados.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Erro de comunicação com o servidor.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (regPassword !== regConfirmPass) {
      setLoading(false);
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    if (!acceptTerms) {
      setLoading(false);
      setErrorMessage('Você precisa aceitar os termos para se cadastrar.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
          planType: 'single'
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        setSuccessMessage('Conta cadastrada com sucesso!');
        setTimeout(() => {
          onClose();
          if (onOpenCheckout) onOpenCheckout();
        }, 900);
      } else {
        setErrorMessage(data.error || 'Erro ao realizar cadastro.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Erro ao conectar ao servidor de cadastro.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      setLoading(false);
      setForgotMessage(data.message || 'Instruções enviadas para seu e-mail.');
    } catch (err) {
      setLoading(false);
      setForgotMessage('Erro ao enviar solicitação.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FDFCF0] text-[#002147] rounded-3xl shadow-2xl border-2 border-[#C5A059] overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="bg-[#002147] text-white p-6 relative border-b border-[#C5A059]/40 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition z-10"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full gold-gradient text-[#002147] flex items-center justify-center mx-auto mb-3 shadow-md border border-[#F1D592]">
            <Cross className="w-7 h-7 stroke-[2.5]" />
          </div>

          <h2 className="text-xl sm:text-2xl serif font-extrabold text-white">
            Fé e Vida Católica
          </h2>
          <p className="text-xs text-[#F1D592] mt-0.5">
            {user ? 'Minha Conta de Fiel' : 'Acesse seu acervo de orações e liturgia'}
          </p>

          {/* Modal Navigation Tabs */}
          {!user && (
            <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-white/10 rounded-xl border border-white/10">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === 'login'
                    ? 'bg-[#C5A059] text-[#002147] shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Entrar na Conta
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === 'register'
                    ? 'bg-[#C5A059] text-[#002147] shadow'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Criar Nova Conta
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-900 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FORGOT PASSWORD MODAL INLINE */}
          {isForgotOpen ? (
            <div className="space-y-4">
              <h3 className="serif font-bold text-base text-[#002147] text-center">
                Redefinir Senha
              </h3>
              <p className="text-xs text-gray-600 text-center">
                Informe o e-mail cadastrado e enviaremos o link de recuperação.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail cadastrado..."
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                {forgotMessage && (
                  <div className="p-3 bg-amber-50 text-amber-950 text-xs rounded-xl border border-amber-200">
                    {forgotMessage}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="w-1/2 py-2.5 bg-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-300 transition"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 py-2.5 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl hover:bg-[#002147]/90 transition"
                  >
                    {loading ? 'Enviando...' : 'Enviar Link'}
                  </button>
                </div>
              </form>
            </div>
          ) : user || activeTab === 'profile' ? (
            /* USER PROFILE VIEW */
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-[#C5A059] flex items-center justify-center mx-auto text-[#002147] font-bold text-xl shadow-inner">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'FI'}
              </div>

              <div>
                <h3 className="serif font-bold text-lg text-[#002147]">{user?.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{user?.email}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-2 text-left text-xs">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-500 font-semibold">Status do Acesso:</span>
                  {user?.role === 'admin' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Administrador Master
                    </span>
                  ) : user?.paymentStatus === 'approved' ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Assinatura Aprovada (Vitalício)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                      Aguardando PIX (R$ 19,00)
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Plano Selecionado:</span>
                  <span className="font-bold text-[#002147]">Acesso Único Premium (R$ 19,00)</span>
                </div>
              </div>

              {/* HISTÓRICO DE PAGAMENTOS */}
              <div className="p-4 bg-[#FDFCF0] rounded-2xl border border-[#C5A059]/40 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-[#C5A059]/30 pb-2">
                  <div className="flex items-center space-x-2 text-[#002147] font-bold text-xs">
                    <Receipt className="w-4 h-4 text-[#C5A059]" />
                    <span className="serif">Histórico de Pagamentos & Recibos</span>
                  </div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    {userPayments.length} registro(s)
                  </span>
                </div>

                {loadingPayments ? (
                  <div className="py-4 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Carregando comprovantes...</span>
                  </div>
                ) : userPayments.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-2 text-center">
                    Nenhum comprovante registrado até o momento.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {userPayments.map(pay => (
                      <div
                        key={pay.id}
                        className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-[#C5A059] transition"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-[#002147] text-xs">
                              R$ {pay.amount.toFixed(2).replace('.', ',')}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 font-bold text-gray-700">
                              {pay.paymentMethod.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500">
                            {new Date(pay.date).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })} • ID: <span className="font-mono">{pay.transactionId}</span>
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            pay.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {pay.status === 'approved' ? 'Aprovado' : 'Pendente'}
                          </span>

                          <button
                            onClick={() => setSelectedReceipt(pay)}
                            className="p-1.5 bg-[#002147] text-[#F1D592] hover:bg-[#002147]/90 rounded-lg transition"
                            title="Ver Comprovante / Recibo"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RECEIPT MODAL POPUP */}
              {selectedReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                  <div className="bg-white border-2 border-[#C5A059] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 text-left">
                    
                    <div className="flex items-center justify-between border-b pb-3 border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-[#002147] font-bold">
                          <Cross className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="serif font-bold text-sm text-[#002147]">Comprovante de Pagamento</h4>
                          <p className="text-[10px] text-gray-500">Fé e Vida Católica Premium</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedReceipt(null)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-4 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Beneficiário:</span>
                        <strong className="text-[#002147]">Fé e Vida Católica Ltda</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fiel / Pagador:</span>
                        <strong className="text-[#002147]">{selectedReceipt.userName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">E-mail:</span>
                        <span className="font-mono text-gray-700">{selectedReceipt.userEmail}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-500">Valor da Transação:</span>
                        <strong className="text-emerald-700 font-mono text-sm">
                          R$ {selectedReceipt.amount.toFixed(2).replace('.', ',')}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Forma de Pagamento:</span>
                        <span className="font-bold uppercase text-[#002147]">{selectedReceipt.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Código de Transação:</span>
                        <span className="font-mono text-[11px] text-gray-800">{selectedReceipt.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Data e Hora:</span>
                        <span className="text-gray-700">
                          {new Date(selectedReceipt.date).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-500">Status do Processamento:</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          selectedReceipt.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {selectedReceipt.status === 'approved' ? 'APROVADO & LIBERADO' : 'AGUARDANDO CONFIRMAÇÃO'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-500 text-center italic">
                      "Dai, e ser-vos-á dado: boa medida, recalcada, sacudida e transbordante." — São Lucas 6, 38
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => window.print()}
                        className="w-full py-2.5 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl hover:bg-[#002147]/90 transition flex items-center justify-center space-x-1.5"
                      >
                        <Printer className="w-4 h-4 text-[#C5A059]" />
                        <span>Imprimir / Salvar PDF</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {user?.paymentStatus !== 'approved' && user?.role !== 'admin' && (
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenCheckout) onOpenCheckout();
                  }}
                  className="w-full py-3 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Efetuar Pagamento PIX (R$ 19,00)</span>
                </button>
              )}

              {onLogout && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 bg-rose-50 text-rose-800 hover:bg-rose-100 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5 border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Minha Conta</span>
                </button>
              )}
            </div>
          ) : activeTab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                  E-mail:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#002147] uppercase">
                    Senha:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(true)}
                    className="text-[11px] text-[#800020] hover:underline font-semibold"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Sua senha..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-[#002147] focus:ring-[#C5A059]"
                  />
                  <span className="text-gray-700">Manter conectado</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl hover:bg-[#002147]/90 transition border border-[#C5A059] shadow-md uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Entrando...' : 'Entrar na Minha Conta'}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Ainda não possui conta?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="font-bold text-[#800020] hover:underline"
                  >
                    Criar cadastro de fiel (R$ 19,00)
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>
                  <strong>Plano Acesso Único Premium:</strong> R$ 19,00. Sem mensalidades!
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                  Nome Completo:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria das Graças Silva"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                  E-mail Principal:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                  Telefone / WhatsApp (Opcional):
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                    Criar Senha:
                  </label>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    required
                    minLength={4}
                    placeholder="Sua senha..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                    Confirmar Senha:
                  </label>
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    required
                    minLength={4}
                    placeholder="Repita a senha..."
                    value={regConfirmPass}
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showRegPass"
                  checked={showRegPass}
                  onChange={(e) => setShowRegPass(e.target.checked)}
                  className="rounded border-gray-300 text-[#002147]"
                />
                <label htmlFor="showRegPass" className="text-[11px] text-gray-600 cursor-pointer">
                  Mostrar caracteres da senha
                </label>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#002147]"
                  />
                  <span className="text-[11px] text-gray-700 leading-tight">
                    Concordo com os Termos de Uso e Política de Privacidade do Fé e Vida Católica.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl hover:bg-[#002147]/90 transition border border-[#C5A059] shadow-md uppercase tracking-wider flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>{loading ? 'Cadastrando...' : 'Cadastrar e Liberar Acesso (R$ 19,00)'}</span>
              </button>

              <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Já possui uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="font-bold text-[#002147] hover:underline"
                  >
                    Fazer Login
                  </button>
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
