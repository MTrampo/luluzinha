'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseHotkeysOptions {
  onOpenCommandPalette?: () => void;
}

export function useHotkeys(options: UseHotkeysOptions = {}) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 1. REGRA DE OURO: Se o usuário estiver digitando em um campo de texto, ignora qualquer atalho!
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          target.getAttribute('role') === 'textbox')
      ) {
        return;
      }

      const isModifier = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();

      // 2. Busca Global / Command Palette: Ctrl + K ou Cmd + K
      if (isModifier && key === 'k') {
        event.preventDefault();
        options.onOpenCommandPalette?.();
        return;
      }

      // 3. Novo Atendimento: Ctrl + N ou Cmd + N
      if (isModifier && key === 'n') {
        event.preventDefault();
        router.push('/painel/agenda/atendimento/novo');
        return;
      }

      // 4. Cadastrar Poderosa: Ctrl + P ou Cmd + P
      if (isModifier && key === 'p') {
        event.preventDefault();
        router.push('/painel/poderosas');
        return;
      }

      // 5. Navegação por abas com Alt (Alt + 1, Alt + 2, etc.)
      if (event.altKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            router.push('/painel');
            break;
          case '2':
            event.preventDefault();
            router.push('/painel/agenda');
            break;
          case '3':
            event.preventDefault();
            router.push('/painel/poderosas');
            break;
          case '4':
            event.preventDefault();
            router.push('/painel/caixa');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, options]);
}
