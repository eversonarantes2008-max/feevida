import React, { useState, useEffect } from 'react';
import {
  Cross, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  ArrowRight, ShieldCheck, Sparkles, Key, UserCheck, LogOut,
  Receipt, FileText, Printer, RefreshCw, X
} from 'lucide-react';
import { UserAccount, PaymentTransaction } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onNavigateToRegister: () => void;
  onOpenCheckout?: () => void;
  user: UserAccount | null;
  onLogout?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onOpenCheckout,
  user,
  onLogout
}) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot password state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  // Payment history state for logged-in user
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
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
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
        setSuccessMessage('Login realizado com sucesso! Seja bem-vindo.');
      } else {
        setErrorMessage(data.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Erro ao comunicar com o servidor. Tente novamente.');
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

  // If already logged in, show user account dashboard view
  if (user) {
    return (
      <div className="max-w-xl mx-auto py-6 px-4 space-y-6">
        <div className="bg-[#002147] text-white p-6 rounded-3xl border-2 border-[#C5A059] shadow-xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full gold-gradient text-[#002147] flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-[#F1D592]">
            <UserCheck className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h2 className="serif font-extrabold text-xl sm:text-2xl text-white">
            Página de Login & Conta
          </h2>
          <p className="text-xs text-[#F1D592] mt-1 font-medium">
            Você está conectado como <strong className="text-white">{user.name}</strong>
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-md space-y-5 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">E-mail de Acesso</p>
              <p className="font-mono font-bold text-[#002147] text-sm">{user.email}</p>
            </div>

            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
              user.paymentStatus === 'approved' || user.role === 'admin'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {user.role === 'admin' ? 'Administrador Master' : user.paymentStatus === 'approved' ? 'Acesso Liberado' : 'Aguardando Liberação'}
            </span>
          </div>

          <div className="p-4 bg-[#FDFCF0] rounded-2xl border border-[#C5A059]/40 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Plano contratado:</span>
              <strong className="text-[#002147]">Acesso Único Premium (R$ 19,00)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Telefone / WhatsApp:</span>
              <span className="text-gray-800 font-medium">{user.phone || 'Não informado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data de Cadastro:</span>
              <span className="text-gray-800">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
              </span>
            </div>
          </div>

          {/* User Payments History */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="serif font-bold text-sm text-[#002147] flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-[#C5A059]" />
                <span>Histórico de Comprovantes</span>
              </h4>
              <span className="text-[10px] text-gray-500 font-bold uppercase">{userPayments.length} registro(s)</span>
            </div>

            {loadingPayments ? (
              <div className="py-4 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                <span>Carregando comprovantes...</span>
              </div>
            ) : userPayments.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-2">Nenhum comprovante encontrado.</p>
            ) : (
              <div className="space-y-2">
                {userPayments.map(pay => (
                  <div key={pay.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#002147]">R$ {pay.amount.toFixed(2).replace('.', ',')}</span>
                      <span className="ml-2 text-[10px] text-gray-500">
                        {new Date(pay.date).toLocaleDateString('pt-BR')} • {pay.transactionId}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(pay)}
                      className="p-1.5 bg-[#002147] text-[#F1D592] rounded-lg hover:bg-[#002147]/90 text-[11px] font-bold flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver Recibo</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            {user.paymentStatus !== 'approved' && user.role !== 'admin' && onOpenCheckout && (
              <button
                onClick={onOpenCheckout}
                className="w-full py-3 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition flex items-center justify-center space-x-1.5 uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4" />
                <span>Efetuar Pagamento PIX (R$ 19)</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Minha Conta</span>
              </button>
            )}
          </div>
        </div>

        {/* RECEIPT MODAL */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white border-2 border-[#C5A059] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
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
                <button onClick={() => setSelectedReceipt(null)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fiel / Pagador:</span>
                  <strong className="text-[#002147]">{selectedReceipt.userName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor da Transação:</span>
                  <strong className="text-emerald-700 font-mono text-sm">R$ {selectedReceipt.amount.toFixed(2).replace('.', ',')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Código de Transação:</span>
                  <span className="font-mono text-[11px] text-gray-800">{selectedReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data e Hora:</span>
                  <span className="text-gray-700">{new Date(selectedReceipt.date).toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl hover:bg-[#002147]/90 transition flex items-center justify-center space-x-1.5"
              >
                <Printer className="w-4 h-4 text-[#C5A059]" />
                <span>Imprimir Recibo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059] shadow-xl text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full gold-gradient text-[#002147] flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-[#F1D592]">
          <Cross className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h1 className="serif font-extrabold text-2xl sm:text-3xl text-white">
          Entrar na Conta
        </h1>
        <p className="text-xs sm:text-sm text-[#F1D592] mt-1 font-medium">
          Acesse seu acervo católico com e-mail e senha
        </p>
      </div>

      {/* Login Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-5">
        
        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-950 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>E-mail do Fiel</span>
            </label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Sua Senha</span>
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-[11px] text-[#C5A059] hover:underline font-semibold"
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#002147] rounded border-gray-300 focus:ring-[#C5A059]"
              />
              <span>Manter conectado</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2 uppercase tracking-wider"
          >
            {loading ? (
              <span>Entrando na conta...</span>
            ) : (
              <>
                <span>Acessar Minha Conta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Separator / Switch to Register */}
        <div className="pt-4 border-t border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-600">
            Ainda não tem uma conta cadastrada?
          </p>
          <button
            onClick={onNavigateToRegister}
            className="w-full py-3 bg-[#002147] hover:bg-[#002147]/90 text-[#F1D592] font-bold text-xs rounded-xl shadow transition border border-[#C5A059] flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Criar Nova Conta de Fiel</span>
          </button>
        </div>

      </div>

      {/* Security badge */}
      <div className="p-3 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl flex items-center space-x-3 text-left">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        <p className="text-[11px] text-gray-700">
          <strong>Acesso Seguro:</strong> Seus dados são protegidos por criptografia de ponta a ponta e respeitam a doutrina católica.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-[#C5A059] rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="serif font-bold text-sm text-[#002147]">Recuperar Senha</h4>
              <button onClick={() => setIsForgotOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Digite o e-mail cadastrado para receber o link de redefinição de senha.
            </p>

            {forgotMessage ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl font-bold">
                {forgotMessage}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full px-3.5 py-2.5 bg-[#FDFCF0] border border-gray-300 rounded-xl text-xs outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 gold-gradient text-[#002147] font-bold text-xs rounded-xl shadow"
                >
                  {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
