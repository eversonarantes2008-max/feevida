import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Check, Volume2, Sparkles, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReminderItem {
  id: string;
  title: string;
  time: string;
  description: string;
  enabled: boolean;
  days?: string[];
}

export const RemindersView: React.FC = () => {
  // Master notification switch
  const [globalNotificationsEnabled, setGlobalNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('global_notifications_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const [reminders, setReminders] = useState<ReminderItem[]>([
    { id: 'angelus_6', title: 'Oração do Ângelus (Manhã)', time: '06:00', description: 'O Anjo do Senhor anunciou a Maria...', enabled: true, days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] },
    { id: 'liturgia_8', title: 'Leitura da Liturgia Diária CNBB', time: '08:00', description: 'Ouça e leia o Santo Evangelho do Dia', enabled: true, days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] },
    { id: 'angelus_12', title: 'Oração do Ângelus (Meio-Dia)', time: '12:00', description: 'E o Verbo se fez carne e habitou entre nós...', enabled: true, days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] },
    { id: 'misericordia_15', title: 'Terço da Divina Misericórdia (Hora da Graça)', time: '15:00', description: 'Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro...', enabled: true, days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] },
    { id: 'angelus_18', title: 'Oração do Ângelus (Tarde)', time: '18:00', description: 'Rogai por nós, Santa Mãe de Deus...', enabled: true, days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] },
    { id: 'terco_20', title: 'Santo Rosário em Família', time: '20:00', description: 'Momento sagrado de oração do Terço da Noite', enabled: true, days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('19:00');
  const [newDescription, setNewDescription] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('global_notifications_enabled', JSON.stringify(globalNotificationsEnabled));
  }, [globalNotificationsEnabled]);

  const handleToggleGlobalNotifications = async () => {
    const nextState = !globalNotificationsEnabled;
    setGlobalNotificationsEnabled(nextState);

    if (nextState && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
      }
    }

    showToast(nextState ? 'Notificações Diárias ativadas!' : 'Todas as Notificações foram desativadas.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateReminderTime = (id: string, time: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, time } : r));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    showToast('Lembrete removido.');
  };

  const handleAddCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newItem: ReminderItem = {
      id: `custom_${Date.now()}`,
      title: newTitle,
      time: newTime,
      description: newDescription || 'Lembrete de oração católica customizado',
      enabled: true,
      days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    };

    setReminders([...reminders, newItem]);
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
    showToast('Novo lembrete criado com sucesso!');
  };

  const handleTestNotification = () => {
    if (!globalNotificationsEnabled) {
      showToast('Ative as Notificações Diárias primeiro para testar.');
      return;
    }

    // Try web speech synthesis sound
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Atenção: É hora da oração do Santo Terço da Misericórdia! Pela Sua dolorosa Paixão, tende misericórdia de nós.');
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }

    // Try native browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Fé e Vida Católica Premium', {
        body: 'É hora do momento de oração e devoção!',
        icon: '/favicon.ico'
      });
    }

    showToast('Notificação de teste e aviso sonoro enviados com sucesso!');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#002147] text-white px-5 py-3 rounded-2xl border border-[#C5A059] shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#F1D592]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#002147] text-white p-6 rounded-2xl border border-[#C5A059] shadow-xl text-center space-y-2 relative overflow-hidden">
        <div className="texture-overlay"></div>
        <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#F1D592] text-xs font-bold uppercase tracking-wider">
          Alertas & Horários de Oração
        </span>
        <h2 className="text-2xl sm:text-3xl serif font-bold text-gold">
          Notificações Diárias
        </h2>
        <p className="text-xs text-gray-300 font-medium max-w-xl mx-auto">
          Escolha livremente se deseja receber lembretes e configure seus horários devocionais
        </p>
      </div>

      {/* Master Toggle Card (Opção de Escolha do Usuário) */}
      <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/40 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              globalNotificationsEnabled ? 'bg-[#002147] text-[#F1D592]' : 'bg-gray-100 text-gray-400'
            }`}>
              {globalNotificationsEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="serif font-bold text-lg text-[#002147]">
                Receber Notificações Diárias
              </h3>
              <p className="text-xs text-gray-600 font-medium">
                {globalNotificationsEnabled
                  ? 'Ativadas. Você receberá avisos nos horários selecionados abaixo.'
                  : 'Desativadas pelo usuário. Nenhuma notificação será enviada.'}
              </p>
            </div>
          </div>

          {/* Big Master Toggle Switch */}
          <button
            onClick={handleToggleGlobalNotifications}
            className={`w-16 h-8 flex items-center rounded-full p-1 transition duration-300 shrink-0 ${
              globalNotificationsEnabled ? 'bg-[#800020] justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition" />
          </button>
        </div>

        {/* Status indicator & Test Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            {globalNotificationsEnabled ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Sistema de Lembretes Pronto
              </span>
            ) : (
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Notificações Silenciadas
              </span>
            )}
          </span>

          <button
            onClick={handleTestNotification}
            className="px-4 py-2 bg-[#002147] text-[#F1D592] font-bold text-xs rounded-xl hover:bg-[#002147]/90 transition border border-[#C5A059] flex items-center space-x-1.5"
          >
            <Volume2 className="w-4 h-4 text-[#C5A059]" />
            <span>Testar Sinal Sonoro & Notificação</span>
          </button>
        </div>
      </div>

      {/* Reminder List Header with Add Button */}
      <div className="flex items-center justify-between">
        <h3 className="serif font-bold text-lg text-[#002147]">
          Horários Devocionais Agendados
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-[#800020] text-white font-bold text-xs rounded-xl hover:bg-[#800020]/90 transition border border-gold shadow-sm flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Lembrete</span>
        </button>
      </div>

      {/* Add Custom Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 border border-[#C5A059] shadow-2xl">
            <h3 className="serif font-bold text-lg text-[#002147] border-b pb-2">
              Adicionar Lembrete Personalizado
            </h3>

            <form onSubmit={handleAddCustomReminder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Título do Lembrete:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Terço das Famílias, Missa do Mês..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-[#FDFCF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Horário:
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-[#FDFCF0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Descrição ou Oração:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rezar a intenção pelos doentes..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-[#FDFCF0]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#002147] text-[#F1D592] border border-[#C5A059] rounded-xl hover:bg-[#002147]/90"
                >
                  Salvar Lembrete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reminder List Items */}
      <div className="space-y-3">
        {reminders.map((item) => (
          <div
            key={item.id}
            className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              item.enabled && globalNotificationsEnabled
                ? 'bg-white border-[#C5A059]/40 shadow-md'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-center space-x-3.5 w-full sm:w-auto">
              <input
                type="time"
                value={item.time}
                onChange={(e) => updateReminderTime(item.id, e.target.value)}
                className={`w-20 py-1.5 px-2 rounded-xl font-mono font-bold text-center text-xs border ${
                  item.enabled && globalNotificationsEnabled
                    ? 'bg-[#002147] text-[#F1D592] border-[#C5A059]'
                    : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
              />

              <div className="flex-1">
                <h4 className="serif font-bold text-sm text-[#002147]">{item.title}</h4>
                <p className="text-xs text-gray-600 line-clamp-1">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              
              <button
                onClick={() => handleDeleteReminder(item.id)}
                className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                title="Excluir Lembrete"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Individual Toggle */}
              <button
                onClick={() => toggleReminder(item.id)}
                disabled={!globalNotificationsEnabled}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 shrink-0 ${
                  item.enabled && globalNotificationsEnabled ? 'bg-emerald-600 justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

