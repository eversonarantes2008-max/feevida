import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, UserCheck, UserX, UserPlus, Lock, Key, RefreshCw, CheckCircle2,
  DollarSign, Users, X, Sparkles, BookOpen, Settings, BarChart2, Check, QrCode, Shield
} from 'lucide-react';
import { UserAccount } from '../types';

interface MasterDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onMasterLoginSuccess: (masterUser: UserAccount) => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  isOpen,
  onClose,
  currentUser,
  onMasterLoginSuccess
}) => {
  const [adminTab, setAdminTab] = useState<'users' | 'financial' | 'kids' | 'settings'>('users');
  const [masterEmailInput, setMasterEmailInput] = useState('');
  const [masterPassInput, setMasterPassInput] = useState('');
  const [isAuthenticatedMaster, setIsAuthenticatedMaster] = useState(false);
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Manual User Creation State
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  const [showAddModal, setShowAddModal] = useState(false);

  // Kids Story Creation State
  const [newKidsTitle, setNewKidsTitle] = useState('');
  const [newKidsMoral, setNewKidsMoral] = useState('');
  const [newKidsRef, setNewKidsRef] = useState('');
  const [kidsCreatedMessage, setKidsCreatedMessage] = useState('');

  const MASTER_EMAIL = 'everson.arantes.2008@gmail.com';
  const PIX_KEY = '27095675805';

  const fetchUsersList = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': 'Bearer master_auth_token_987213'
        }
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.users) {
        setUsersList(data.users);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin' && currentUser?.email?.toLowerCase() === MASTER_EMAIL) {
      setIsAuthenticatedMaster(true);
      fetchUsersList();
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleMasterLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: masterEmailInput,
          password: masterPassInput
        })
      });

      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setIsAuthenticatedMaster(true);
        const masterUser: UserAccount = {
          id: 'usr_master_001',
          email: MASTER_EMAIL,
          name: 'Everson Arantes (Administrador Master)',
          role: 'admin',
          paymentStatus: 'approved',
          planType: 'single',
          createdAt: new Date().toISOString()
        };
        onMasterLoginSuccess(masterUser);
        fetchUsersList();
      } else {
        setLoginError(data.error || 'E-mail ou Senha de Administrador Master incorretos.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setLoginError('Erro de conexão com o servidor master.');
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        fetchUsersList();
      }
    } catch (err) {
      alert('Erro ao autorizar usuário.');
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const res = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        fetchUsersList();
      }
    } catch (err) {
      alert('Erro ao revogar usuário.');
    }
  };

  const handleCreateManualUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail) return;

    try {
      const res = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: manualName || manualEmail.split('@')[0],
          email: manualEmail,
          paymentMethod: manualPaymentMethod
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setManualEmail('');
        setManualName('');
        fetchUsersList();
      }
    } catch (err) {
      alert('Erro ao adicionar usuário.');
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'pending') return matchesSearch && u.paymentStatus === 'pending';
    if (statusFilter === 'approved') return matchesSearch && u.paymentStatus === 'approved';
    if (statusFilter === 'rejected') return matchesSearch && u.paymentStatus === 'rejected';
    return matchesSearch;
  });

  const approvedCount = usersList.filter(u => u.paymentStatus === 'approved').length;
  const pendingCount = usersList.filter(u => u.paymentStatus === 'pending').length;
  const rejectedCount = usersList.filter(u => u.paymentStatus === 'rejected').length;
  const totalRevenue = approvedCount * 19;
  const pendingRevenue = pendingCount * 19;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#FDFCF0] text-[#002147] rounded-3xl shadow-2xl border-2 border-[#C5A059] overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Admin Header Bar */}
        <div className="bg-[#002147] text-white p-5 sm:p-6 relative border-b border-[#C5A059]/40 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition z-10"
            title="Fechar Painel"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059] text-[#002147] flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 text-[#F1D592] text-[10px] font-bold uppercase tracking-wider mb-0.5 border border-[#C5A059]/40">
                  <Shield className="w-3 h-3 text-[#C5A059]" />
                  <span>DASHBOARD ADMINISTRATIVO MASTER</span>
                </div>
                <h2 className="text-xl sm:text-2xl serif font-extrabold text-white">
                  Painel de Controle e Liberações (Plano R$ 19,00)
                </h2>
                <p className="text-xs text-[#F1D592]">
                  {isAuthenticatedMaster ? `Conectado como: ${MASTER_EMAIL}` : 'Acesso Restrito ao Administrador Master'}
                </p>
              </div>
            </div>

            {isAuthenticatedMaster && (
              <button
                onClick={fetchUsersList}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#F1D592] rounded-xl text-xs font-bold border border-[#C5A059]/40 flex items-center space-x-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Atualizar Dados</span>
              </button>
            )}
          </div>

          {/* Navigation Tabs for Master Admin */}
          {isAuthenticatedMaster && (
            <div className="flex flex-wrap gap-2 pt-5 border-t border-white/10 mt-4">
              <button
                onClick={() => setAdminTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  adminTab === 'users'
                    ? 'bg-[#C5A059] text-[#002147] shadow-md'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Aprovações de Fiéis ({usersList.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('financial')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  adminTab === 'financial'
                    ? 'bg-[#C5A059] text-[#002147] shadow-md'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Relatório Financeiro (R$ {totalRevenue})</span>
              </button>

              <button
                onClick={() => setAdminTab('kids')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  adminTab === 'kids'
                    ? 'bg-[#C5A059] text-[#002147] shadow-md'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Gestão da Área Kids</span>
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  adminTab === 'settings'
                    ? 'bg-[#C5A059] text-[#002147] shadow-md'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Configurações & Chave PIX</span>
              </button>
            </div>
          )}

        </div>

        {/* Scrollable Main Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Auth Gate for Master Login */}
          {!isAuthenticatedMaster ? (
            <div className="p-8 max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-[#002147] border border-[#C5A059] flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8 text-[#C5A059]" />
              </div>

              <div>
                <h3 className="text-xl serif font-bold text-[#002147]">
                  Autenticação do Administrador Master
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Somente o login master pode conceder ou revogar acessos ao aplicativo após o cadastro dos fiéis.
                </p>
              </div>

              <form onSubmit={handleMasterLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                    E-mail do Administrador Master:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Seu e-mail master..."
                    value={masterEmailInput}
                    onChange={(e) => setMasterEmailInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002147] uppercase mb-1">
                    Senha Master:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Sua senha master..."
                    value={masterPassInput}
                    onChange={(e) => setMasterPassInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-red-100 text-red-800 text-xs rounded-xl font-semibold text-center border border-red-300">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#002147] text-[#F1D592] font-bold rounded-xl hover:bg-[#002147]/90 transition flex items-center justify-center space-x-2 border border-[#C5A059] shadow-md uppercase text-xs tracking-wider"
                >
                  <Key className="w-4 h-4 text-[#C5A059]" />
                  <span>Entrar no Dashboard Master</span>
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* TAB 1: USERS APPROVALS */}
              {adminTab === 'users' && (
                <div className="space-y-6">
                  
                  {/* Quick Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-gray-500 font-bold uppercase block">Total de Cadastros</span>
                        <span className="text-2xl font-bold text-[#002147]">{usersList.length}</span>
                      </div>
                      <Users className="w-8 h-8 text-[#002147]" />
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-amber-900 font-bold uppercase block">Pendentes PIX</span>
                        <span className="text-2xl font-bold text-[#800020]">{pendingCount}</span>
                      </div>
                      <DollarSign className="w-8 h-8 text-[#800020]" />
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-emerald-900 font-bold uppercase block">Aprovados</span>
                        <span className="text-2xl font-bold text-emerald-700">{approvedCount}</span>
                      </div>
                      <UserCheck className="w-8 h-8 text-emerald-600" />
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-gray-500 font-bold uppercase block">Receita Aprovada</span>
                        <span className="text-xl font-bold text-emerald-800">R$ {totalRevenue},00</span>
                      </div>
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                  </div>

                  {/* Filter & Action Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs bg-[#FDFCF0] focus:outline-none focus:ring-2 focus:ring-[#C5A059] w-full sm:w-64"
                      />

                      <div className="flex gap-1 w-full sm:w-auto">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            statusFilter === 'all' ? 'bg-[#002147] text-white' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          Todos ({usersList.length})
                        </button>
                        <button
                          onClick={() => setStatusFilter('pending')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            statusFilter === 'pending' ? 'bg-[#800020] text-white' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          Pendentes ({pendingCount})
                        </button>
                        <button
                          onClick={() => setStatusFilter('approved')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            statusFilter === 'approved' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          Aprovados ({approvedCount})
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl hover:bg-[#002147]/90 transition flex items-center justify-center space-x-1.5 border border-[#C5A059] uppercase tracking-wider"
                    >
                      <UserPlus className="w-4 h-4 text-[#C5A059]" />
                      <span>Autorizar Fiel Manualmente</span>
                    </button>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-sm">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#002147] text-[#F1D592] uppercase tracking-wider text-[11px] font-bold">
                          <th className="p-3.5">Fiel / E-mail</th>
                          <th className="p-3.5">Plano / Método</th>
                          <th className="p-3.5">Data de Registro</th>
                          <th className="p-3.5">Status de Acesso</th>
                          <th className="p-3.5 text-right">Ação do Master</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-gray-500">
                              Nenhum registro encontrado no sistema.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-[#FDFCF0] transition">
                              <td className="p-3.5">
                                <div className="font-bold text-[#002147]">{u.name}</div>
                                <div className="text-gray-500 font-mono text-[11px]">{u.email}</div>
                              </td>
                              <td className="p-3.5">
                                <span className="uppercase font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-[10px]">
                                  {u.paymentMethod || 'Pix'} (R$ 19,00)
                                </span>
                              </td>
                              <td className="p-3.5 text-gray-600">
                                {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="p-3.5">
                                {u.paymentStatus === 'approved' ? (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Aprovado</span>
                                  </span>
                                ) : u.paymentStatus === 'pending' ? (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                    <span>Pendente PIX</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                                    <span>Rejeitado</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5 text-right space-x-2">
                                {u.email?.toLowerCase() === MASTER_EMAIL ? (
                                  <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Administrador Master</span>
                                ) : (
                                  <>
                                    {u.paymentStatus !== 'approved' && (
                                      <button
                                        onClick={() => handleApproveUser(u.id)}
                                        className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-lg transition uppercase tracking-wider shadow"
                                      >
                                        AUTORIZAR
                                      </button>
                                    )}

                                    {u.paymentStatus === 'approved' && (
                                      <button
                                        onClick={() => handleRejectUser(u.id)}
                                        className="px-3 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded-lg transition uppercase tracking-wider"
                                      >
                                        Revogar
                                      </button>
                                    )}
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 2: FINANCIAL REPORT */}
              {adminTab === 'financial' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="serif font-bold text-lg text-[#002147] border-b border-gray-100 pb-2">
                      Relatório Financeiro de Assinaturas (Plano R$ 19,00)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                        <span className="text-xs font-bold text-emerald-800 uppercase block">Receita Efetivada</span>
                        <div className="text-3xl serif font-extrabold text-emerald-700">
                          R$ {totalRevenue},00
                        </div>
                        <span className="text-[11px] text-emerald-800 font-medium">{approvedCount} assinaturas confirmadas</span>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                        <span className="text-xs font-bold text-amber-900 uppercase block">Receita Em Análise (PIX)</span>
                        <div className="text-3xl serif font-extrabold text-[#800020]">
                          R$ {pendingRevenue},00
                        </div>
                        <span className="text-[11px] text-amber-900 font-medium">{pendingCount} fiéis aguardando verificação</span>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-700 space-y-1">
                        <span className="text-xs font-bold text-slate-300 uppercase block">Canal Principal</span>
                        <div className="text-xl serif font-bold text-[#F1D592]">
                          PIX Direto
                        </div>
                        <span className="text-[11px] text-slate-300 font-mono">Chave: {PIX_KEY}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: KIDS CONTENT MANAGEMENT */}
              {adminTab === 'kids' && (
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="serif font-bold text-lg text-[#002147] border-b border-gray-100 pb-2">
                    Gestão de Conteúdo e Histórias da Área Kids
                  </h3>
                  <p className="text-xs text-gray-600">
                    O Administrador Master pode criar histórias exclusivas ou destacar conteúdos para os pequenos fiéis.
                  </p>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
                    <p className="font-bold flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>Área Kids em Pleno Funcionamento</span>
                    </p>
                    <p>
                      As histórias contam com narração sintética em áudio, jogos interativos (Quebra-Cabeça Sagrado, Quiz Bíblico e Jogo da Memória) e caderno de desenhos para colorir.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: SYSTEM SETTINGS */}
              {adminTab === 'settings' && (
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
                  <h3 className="serif font-bold text-lg text-[#002147] border-b border-gray-100 pb-2">
                    Configurações Gerais do Aplicativo
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-[#FDFCF0] rounded-2xl border border-gray-200 space-y-2">
                      <span className="font-bold text-[#002147] uppercase block">Administrador Master Responsável</span>
                      <p className="font-semibold text-gray-800">{MASTER_EMAIL}</p>
                      <p className="text-gray-500">Único e-mail com autoridade para aprovar fiéis.</p>
                    </div>

                    <div className="p-4 bg-[#FDFCF0] rounded-2xl border border-gray-200 space-y-2">
                      <span className="font-bold text-[#002147] uppercase block">Chave PIX Cadastrada</span>
                      <p className="font-bold text-[#800020] font-mono text-sm">{PIX_KEY}</p>
                      <p className="text-gray-500">Valor do Plano Básico: <strong>R$ 19,00</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Manual Add */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full space-y-4 border-2 border-[#C5A059]">
              <h3 className="serif font-bold text-lg text-[#002147]">
                Autorizar Novo Fiel Manualmente
              </h3>

              <form onSubmit={handleCreateManualUser} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#002147] uppercase mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002147] uppercase mb-1">E-mail do Fiel</label>
                  <input
                    type="email"
                    required
                    placeholder="fiel@gmail.com"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 transition shadow"
                  >
                    Aprovar Acesso Imediato
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
