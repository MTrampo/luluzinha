'use client'

import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { APPLICATION_SERVER_KEY_PUBLIC } from '@/commons/constants/notification';

const NotificationPermission: React.FC = () => {

  const subscribeToPush = async () => {
    // Verifique o suporte do navegador
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.error('Notificações e Service Worker não são suportados.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: APPLICATION_SERVER_KEY_PUBLIC
      });

      // Envia a inscrição para o seu backend
      await fetch('/api/subscribe/notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      console.log('Inscrição para notificações enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao inscrever-se para push notifications:', error);
    }
  };

  interface ToastCustomProps {
    t: string | number;
  }

  const handleClickActive = ({ t }: ToastCustomProps): void => {
    toast.dismiss(t);
    // Pedir a permissão e se inscrever
    Notification.requestPermission().then((permission: NotificationPermission) => {
      if (permission === 'granted') {
        subscribeToPush();
      } else {
        console.warn('Permissão para notificação negada.');
      }
    });
  };

  useEffect((): void => {
    // Verifica a permissão de notificação quando o componente é montado
    if (Notification.permission === 'default' || Notification.permission === "denied") {
      // Exibe um toast do Sonner para pedir a permissão
      toast.custom((t: string | number) => (
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col gap-2">
          <p className="font-medium">Ative as notificações para receber atualizações!</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                handleClickActive({ t });
              }}
              className="bg-primary text-white py-1 px-3 rounded-md text-sm hover:bg-primary/90"
            >
              Ativar
            </button>
            <button onClick={() => toast.dismiss(t)} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-md text-sm hover:bg-gray-300">
              Agora não
            </button>
          </div>
        </div>
      ), { duration: 100000 });
    }
  }, []);

  return null;
};

export default NotificationPermission;