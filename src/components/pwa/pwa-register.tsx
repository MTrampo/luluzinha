'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { registerPwaServiceWorker } from '@/commons/utils/pwa';

export function PwaRegister() {
  useEffect(() => {
    registerPwaServiceWorker();

    const handleUpdateAvailable = () => {
      toast('Nova versão do Seu Espaço disponível!', {
        description: 'Toque para atualizar e carregar as novidades.',
        action: {
          label: 'Atualizar',
          onClick: () => {
            window.location.reload();
          },
        },
        duration: 8000,
      });
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  return null;
}
