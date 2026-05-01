'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function ToastError({ message }: { message: string }) {
  useEffect(() => {
    if (message) {
      toast.error('Ocorreu um erro', {
        description: message,
      });
    }
  }, [message]);

  return null;
}
