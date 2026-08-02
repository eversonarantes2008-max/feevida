import React, { useState, useEffect } from 'react';
import {
  Cross, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  ArrowRight, ShieldCheck, Sparkles, Key, UserCheck, LogOut,
  Receipt, FileText, Printer, RefreshCw, X, Copy, Check
} from 'lucide-react';
import { UserAccount, PaymentTransaction } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onNavigateToRegister: () => void;
  onOpenCheckout?: () => void;
  user: UserAccount | null;
  onLogout?: () => void;
  onOpenMasterDashboard?: () => void;
  onNavigateToApp?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onOpenCheckout,
  user,
  onLogout,
  onOpenMasterDashboard,
  onNavigateToApp
}) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password recovery state machine
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3 | 4>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [receivedCode, setReceivedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

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

  const openRecoveryModal = () => {
    setForgotEmail(loginEmail || '');
    setVerificationCode('');
    setReceivedCode('');
    setNewPassword('');
    setConfirmPassword('');
    setRecoveryError('');
    setRecoverySuccess('');
    setRecoveryStep(1);
    setIsForgotOpen(true);
  };

  const closeRecoveryModal = () => {
    setIsForgotOpen(false);
    setRecoveryStep(1);
    setRecoveryError('');
    setRecoverySuccess('');
  };

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

  // STEP 1: Request Code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!forgotEmail || !forgotEmail.trim()) {
      setRecoveryError('Informe o seu e-mail cadastrado.');
      return;
    }

    if (!forgotEmail.includes('@') || !forgotEmail.includes('.')) {
      setRecoveryError('Informe um e-mail válido no formato nome@dominio.com');
      return;
    }

    setRecoveryLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      setRecoveryLoading(false);

      if (data.success) {
        setReceivedCode(data.code || '');
        setRecoveryStep(2);
        setRecoverySuccess(data.message || 'Código enviado com sucesso!');
      } else {
        setRecoveryError(data.error || 'Não foi possível solicitar o código de verificação.');
      }
    } catch (err) {
      setRecoveryLoading(false);
      setRecoveryError('Erro de conexão ao enviar solicitação.');
    }
  };

  // STEP 2: Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    const cleanCode = verificationCode.trim();
    if (!cleanCode) {
      setRecoveryError('Digite o código de verificação de 6 dígitos.');
      return;
    }

    if (cleanCode.length !== 6 || !/^\d+$/.test(cleanCode)) {
      setRecoveryError('O código deve conter exatamente 6 números.');
      return;
    }

    setRecoveryLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          code: cleanCode
        })
      });
      const data = await res.json();
      setRecoveryLoading(false);

      if (data.success) {
        setRecoveryStep(3);
        setRecoverySuccess('Código verificado! Agora cadastre sua nova senha.');
      } else {
        setRecoveryError(data.error || 'Código incorreto ou expirado. Tente novamente.');
      }
    } catch (err) {
      setRecoveryLoading(false);
      setRecoveryError('Erro ao validar o código.');
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!newPassword) {
      setRecoveryError('A nova senha é obrigatória.');
      return;
    }

    if (newPassword.length < 4) {
      setRecoveryError('A nova senha deve possuir no mínimo 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setRecoveryError('As senhas não coincidem. Digite a mesma senha em ambos os campos.');
      return;
    }

    setRecoveryLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          code: verificationCode.trim(),
          newPassword: newPassword
        })
      });
      const data = await res.json();
      setRecoveryLoading(false);

      if (data.success) {
        setRecoveryStep(4);
        setRecoverySuccess(data.message || 'Sua senha foi redefinida com sucesso!');
      } else {
        setRecoveryError(data.error || 'Erro ao redefinir a senha.');
      }
    } catch (err) {
      setRecoveryLoading(false);
      setRecoveryError('Erro de conexão ao salvar a nova senha.');
    }
  };

  // STEP 4: Finish & Return to Login
  const handleFinishRecovery = () => {
    setLoginEmail(forgotEmail);
    setLoginPassword('');
    setErrorMessage('');
    setSuccessMessage('Sua senha foi redefinida com sucesso! Digite sua nova senha para entrar.');
    closeRecoveryModal();
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

          {/* Admin Master Navigation Options */}
          {user.role === 'admin' && (
            <div className="p-4 bg-emerald-950/10 border-2 border-emerald-500/40 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Opções do Administrador Master</span>
              </div>
              <p className="text-xs text-gray-600">
                Como Master, você tem acesso irrestrito ao aplicativo de orações e ao painel completo de controle. Escolha para onde deseja ir:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {onNavigateToApp && (
                  <button
                    onClick={onNavigateToApp}
                    className="py-3 px-4 bg-[#002147] hover:bg-[#002147]/90 text-[#F1D592] font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2 border border-[#C5A059]"
                  >
                    <span>📖 Entrar no Aplicativo</span>
                  </button>
                )}

                {onOpenMasterDashboard && (
                  <button
                    onClick={onOpenMasterDashboard}
                    className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2 border border-emerald-500"
                  >
                    <span>🛡️ Abrir Painel Dashboard</span>
                  </button>
                )}
              </div>
            </div>
          )}

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
                onClick={openRecoveryModal}
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

      {/* Forgot Password Recovery Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white border-2 border-[#C5A059] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 text-left relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-[#002147] shadow border border-[#F1D592]">
                  <Key className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="serif font-bold text-base text-[#002147]">Recuperação de Senha</h4>
                  <p className="text-[11px] text-[#C5A059] font-bold">
                    {recoveryStep === 1 && 'Passo 1 de 3 • Informar E-mail'}
                    {recoveryStep === 2 && 'Passo 2 de 3 • Digitar Código'}
                    {recoveryStep === 3 && 'Passo 3 de 3 • Nova Senha'}
                    {recoveryStep === 4 && 'Concluído com Sucesso'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeRecoveryModal}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress Bar */}
            {recoveryStep < 4 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex-1 h-2 rounded-full transition-all ${recoveryStep >= 1 ? 'gold-gradient' : 'bg-gray-200'}`} />
                  <div className={`flex-1 h-2 rounded-full transition-all ${recoveryStep >= 2 ? 'gold-gradient' : 'bg-gray-200'}`} />
                  <div className={`flex-1 h-2 rounded-full transition-all ${recoveryStep >= 3 ? 'gold-gradient' : 'bg-gray-200'}`} />
                </div>
              </div>
            )}

            {/* Error Feedback Alert */}
            {recoveryError && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs rounded-xl flex items-start space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{recoveryError}</span>
              </div>
            )}

            {/* Success Feedback Alert */}
            {recoverySuccess && recoveryStep !== 4 && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-start space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{recoverySuccess}</span>
              </div>
            )}

            {/* STEP 1: Inform Email */}
            {recoveryStep === 1 && (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Informe o e-mail cadastrado na sua conta de fiel para enviarmos o código de verificação de 6 dígitos.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Seu E-mail Cadastrado</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => { setForgotEmail(e.target.value); setRecoveryError(''); }}
                    placeholder="seu.email@exemplo.com"
                    className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition font-medium"
                  />
                  {forgotEmail && !forgotEmail.includes('@') && (
                    <p className="text-[11px] text-amber-700 italic">Digite um e-mail válido (ex: fiel@gmail.com)</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={recoveryLoading || !forgotEmail}
                    className="w-full py-3.5 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50"
                  >
                    {recoveryLoading ? (
                      <span className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Enviando código...</span>
                      </span>
                    ) : (
                      <>
                        <span>Enviar Código de Verificação</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Input Verification Code */}
            {recoveryStep === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Digite o código de 6 dígitos enviado para o e-mail: <strong className="text-[#002147] font-mono">{forgotEmail}</strong>
                </p>

                {/* Received Code Helper Badge */}
                {receivedCode && (
                  <div className="p-3.5 bg-[#002147] border border-[#C5A059] text-white rounded-2xl space-y-1.5 text-xs shadow-inner">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F1D592] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                        Código de Verificação Gerado
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVerificationCode(receivedCode);
                          setCodeCopied(true);
                          setTimeout(() => setCodeCopied(false), 2000);
                        }}
                        className="px-2.5 py-1 bg-[#C5A059] text-[#002147] font-extrabold text-[10px] rounded-lg hover:bg-[#b08c48] transition flex items-center space-x-1 shadow"
                      >
                        {codeCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{codeCopied ? 'Preenchido!' : 'Copiar Código'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-2xl tracking-[0.35em] font-extrabold text-center text-[#F1D592] py-1">
                      {receivedCode}
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
                      <Key className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Digite o Código</span>
                    </label>
                    <span className="text-[10px] text-gray-500 font-bold">
                      {verificationCode.length}/6 dígitos
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setVerificationCode(val);
                      setRecoveryError('');
                    }}
                    placeholder="123456"
                    className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-center text-xl font-mono tracking-[0.3em] font-bold text-[#002147] outline-none transition"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="submit"
                    disabled={recoveryLoading || verificationCode.length !== 6}
                    className="w-full py-3.5 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50"
                  >
                    {recoveryLoading ? (
                      <span className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Validando código...</span>
                      </span>
                    ) : (
                      <>
                        <span>Validar Código</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => { setRecoveryStep(1); setRecoveryError(''); }}
                      className="text-gray-500 hover:text-[#002147] font-semibold"
                    >
                      ← Alterar E-mail
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestCode}
                      className="text-[#C5A059] hover:underline font-bold"
                    >
                      Reenviar Código
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: Register New Password */}
            {recoveryStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Digite e confirme sua nova senha de acesso para a conta <strong className="text-[#002147] font-mono">{forgotEmail}</strong>.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Nova Senha</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setRecoveryError(''); }}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newPassword && newPassword.length < 4 && (
                    <p className="text-[11px] text-red-600 font-medium">A senha deve possuir no mínimo 4 caracteres.</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Confirmar Nova Senha</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setRecoveryError(''); }}
                      placeholder="Repita a nova senha"
                      className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>As senhas coincidem perfeitamente!</span>
                    </p>
                  )}

                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>As senhas não coincidem. Digite novamente.</span>
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={recoveryLoading || newPassword.length < 4 || newPassword !== confirmPassword}
                    className="w-full py-3.5 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50"
                  >
                    {recoveryLoading ? (
                      <span className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Salvando nova senha...</span>
                      </span>
                    ) : (
                      <>
                        <span>Cadastrar Nova Senha</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Success Screen */}
            {recoveryStep === 4 && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h4 className="serif font-extrabold text-lg text-[#002147]">
                    Senha Redefinida com Sucesso!
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    Sua nova senha foi cadastrada em nossa base com total segurança. Clique abaixo para entrar na sua conta.
                  </p>
                </div>

                <div className="p-3.5 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl text-xs text-left text-gray-700 space-y-1">
                  <p><strong>E-mail de acesso:</strong> <span className="font-mono text-[#002147]">{forgotEmail}</span></p>
                  <p className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pronto para realizar o login</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFinishRecovery}
                  className="w-full py-3.5 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2 uppercase tracking-wider"
                >
                  <span>Acessar Minha Conta Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
