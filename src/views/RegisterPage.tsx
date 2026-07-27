import React, { useState } from 'react';
import {
  Cross, User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  ArrowRight, ShieldCheck, Sparkles, Check
} from 'lucide-react';
import { UserAccount } from '../types';

interface RegisterPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  onNavigateToLogin: () => void;
  onOpenCheckout?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onLoginSuccess,
  onNavigateToLogin,
  onOpenCheckout
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setLoading(false);
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    if (!acceptTerms) {
      setLoading(false);
      setErrorMessage('Você precisa aceitar os termos de uso para se cadastrar.');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          planType: 'single'
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        onLoginSuccess(data.user);
        setSuccessMessage('Conta de fiel cadastrada com sucesso!');
        setTimeout(() => {
          if (onOpenCheckout) {
            onOpenCheckout();
          } else {
            onNavigateToLogin();
          }
        }, 1000);
      } else {
        setErrorMessage(data.error || 'Erro ao efetuar o cadastro. Tente outro e-mail.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage('Erro de conexão ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#002147] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#C5A059] shadow-xl text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-full gold-gradient text-[#002147] flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-[#F1D592]">
          <Cross className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h1 className="serif font-extrabold text-2xl sm:text-3xl text-white">
          Criar Nova Conta
        </h1>
        <p className="text-xs sm:text-sm text-[#F1D592] mt-1 font-medium">
          Cadastre-se para liberar seu acervo diário de oração
        </p>
      </div>

      {/* Benefits highlight card */}
      <div className="p-4 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl space-y-2 text-xs text-left">
        <p className="font-bold text-[#002147] flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>Benefícios do Acesso Único (R$ 19,00):</span>
        </p>
        <ul className="space-y-1 text-gray-700 text-[11px] pl-1">
          <li className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Liturgia Diária Completa com áudio em voz natural</span>
          </li>
          <li className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Bíblia Ave Maria de 73 livros e Santo Terço em áudio</span>
          </li>
          <li className="flex items-center space-x-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Área Kids com historinhas católicas e orações infantis</span>
          </li>
        </ul>
      </div>

      {/* Registration Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-5 text-left">
        
        {/* Alerts */}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Nome Completo do Fiel</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria das Graças Silva"
              className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>E-mail Pessoal</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Celular com DDD (WhatsApp)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-8888"
              className="w-full px-4 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#002147] flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Senha</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full px-3.5 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#002147]">
                Confirmar Senha
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-3.5 py-3 bg-[#FDFCF0] border border-gray-300 focus:border-[#C5A059] rounded-xl text-xs outline-none transition"
              />
            </div>
          </div>

          <label className="flex items-start space-x-2 text-xs text-gray-600 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 text-[#002147] rounded border-gray-300 focus:ring-[#C5A059] mt-0.5"
            />
            <span className="text-[11px] leading-tight">
              Li e concordo com os <strong>Termos de Uso e Política de Privacidade Católicas</strong>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 gold-gradient text-[#002147] font-extrabold text-xs rounded-xl shadow-lg hover:opacity-95 transition flex items-center justify-center space-x-2 uppercase tracking-wider"
          >
            {loading ? (
              <span>Cadastrando...</span>
            ) : (
              <>
                <span>Concluir Cadastro & Prosseguir</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="pt-4 border-t border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-600">
            Já possui uma conta cadastrada no aplicativo?
          </p>
          <button
            onClick={onNavigateToLogin}
            className="w-full py-3 bg-[#002147] hover:bg-[#002147]/90 text-[#F1D592] font-bold text-xs rounded-xl shadow transition border border-[#C5A059] flex items-center justify-center space-x-1.5"
          >
            <User className="w-4 h-4 text-[#C5A059]" />
            <span>Faça Login na Sua Conta Aqui</span>
          </button>
        </div>

      </div>

      {/* Security badge */}
      <div className="p-3 bg-[#FDFCF0] border border-[#C5A059]/40 rounded-2xl flex items-center space-x-3 text-left">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        <p className="text-[11px] text-gray-700">
          <strong>Cadastro Protegido:</strong> Suas informações são confidenciais e mantidas sob sigilo absoluto.
        </p>
      </div>

    </div>
  );
};
