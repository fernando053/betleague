import { useState, useEffect } from 'react';
import api from '../lib/api';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    api.get('/notifications').then((r) => setNotifications(r.data)).catch(() => {});
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // ignore
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'BET_WON': return '🎉';
      case 'BET_LOST': return '😔';
      case 'BET_CREATED': return '🎟️';
      case 'RANKING_CHANGE': return '🏆';
      default: return '🔔';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Notificações</h1>
        <button onClick={markAllRead} className="text-xs text-neon-green hover:underline">
          Marcar tudo como lido
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => !notif.read && markRead(notif.id)}
            className={`card-bet p-4 flex items-start gap-3 cursor-pointer transition-all ${
              !notif.read ? 'border-neon-green/30 bg-neon-green/5' : ''
            }`}
          >
            <span className="text-xl">{getIcon(notif.type)}</span>
            <div className="flex-1">
              <p className={`text-sm ${!notif.read ? 'font-semibold text-white' : 'text-gray-500'}`}>
                {notif.message}
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                {new Date(notif.createdAt).toLocaleString('pt-PT')}
              </p>
            </div>
            {!notif.read && (
              <span className="w-2 h-2 bg-neon-green rounded-full mt-2 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16 card-bet">
          <p className="text-gray-500">Sem notificações</p>
        </div>
      )}
    </div>
  );
}
