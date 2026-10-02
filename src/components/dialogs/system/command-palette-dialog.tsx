'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Search,
  Calendar,
  Users,
  WalletCards,
  Paintbrush,
  Home,
  User,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface CommandPaletteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  hotkey?: string;
  keywords?: string[];
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    id: 'new-appointment',
    title: 'Novo Atendimento',
    category: 'Ações Rápidas',
    url: '/painel/agenda/atendimento/novo',
    icon: PlusCircle,
    hotkey: 'Ctrl+N',
    keywords: ['agendar', 'marcar', 'horario', 'atendimento', 'cliente'],
  },
  {
    id: 'new-customer',
    title: 'Cadastrar Poderosa',
    category: 'Ações Rápidas',
    url: '/painel/poderosas',
    icon: Users,
    hotkey: 'Ctrl+P',
    keywords: ['cliente', 'poderosa', 'cadastrar', 'nova', 'adicionar'],
  },
  {
    id: 'schedule',
    title: 'Agenda de Atendimentos',
    category: 'Navegação',
    url: '/painel/agenda',
    icon: Calendar,
    hotkey: 'Alt+2',
    keywords: ['agenda', 'horarios', 'hoje', 'semana', 'calendario'],
  },
  {
    id: 'customers',
    title: 'Poderosas (Clientes)',
    category: 'Navegação',
    url: '/painel/poderosas',
    icon: Users,
    hotkey: 'Alt+3',
    keywords: ['poderosas', 'clientes', 'fichas', 'aniversarios'],
  },
  {
    id: 'cash',
    title: 'Seu Caixa (Financeiro)',
    category: 'Navegação',
    url: '/painel/caixa',
    icon: WalletCards,
    hotkey: 'Alt+4',
    keywords: ['caixa', 'financeiro', 'recebiveis', 'lucro', 'faturamento'],
  },
  {
    id: 'procedures',
    title: 'Menu de Procedimentos',
    category: 'Navegação',
    url: '/painel/procedimentos',
    icon: Paintbrush,
    keywords: ['procedimentos', 'servicos', 'precos', 'unhas', 'esmalte'],
  },
  {
    id: 'home',
    title: 'Início',
    category: 'Navegação',
    url: '/painel',
    icon: Home,
    hotkey: 'Alt+1',
    keywords: ['inicio', 'home', 'painel', 'resumo'],
  },
  {
    id: 'space',
    title: 'Meu Espaço',
    category: 'Configurações',
    url: '/painel/bancada',
    icon: Sparkles,
    keywords: ['espaco', 'bancada', 'salao', 'horarios', 'configuracao'],
  },
  {
    id: 'account',
    title: 'Minha Conta',
    category: 'Configurações',
    url: '/painel/conta',
    icon: User,
    keywords: ['conta', 'perfil', 'senha', 'email'],
  },
];

export function CommandPaletteDialog({ open, onOpenChange }: CommandPaletteDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtra itens por título ou palavras-chave
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return COMMAND_ITEMS;

    return COMMAND_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.includes(q));
      return matchTitle || matchCategory || matchKeywords;
    });
  }, [query]);

  // Foco no input ao abrir
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
    onOpenChange(isOpen);
  };

  const handleSelect = (url: string) => {
    handleOpenChange(false);
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev - 1 < 0 ? Math.max(filteredItems.length - 1, 0) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        handleSelect(current.url);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-xl p-0 gap-0 overflow-hidden rounded-2xl border-purple-100 shadow-2xl bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Busca Rápida</DialogTitle>
          <DialogDescription>Acesse qualquer página ou ação no sistema</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 px-4 border-b border-purple-100/70 h-14 bg-purple-50/40">
          <Search className="w-4 h-4 text-purple-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="O que você deseja fazer ou acessar? (Ex: agenda, caixa, poderosa...)"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <span className="text-[10px] font-mono text-muted-foreground bg-white px-2 py-0.5 rounded-md border border-purple-100 shadow-2xs">
            ESC para fechar
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma ação encontrada para &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-purple-100/70 text-purple-950 font-medium'
                      : 'text-foreground hover:bg-purple-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-purple-50 text-purple-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm truncate">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground">{item.category}</p>
                    </div>
                  </div>

                  {item.hotkey && (
                    <span className="text-[10px] font-mono text-purple-900/60 bg-white/80 px-2 py-0.5 rounded-md border border-purple-100 shadow-2xs">
                      {item.hotkey}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-purple-50/40 border-t border-purple-100/60 text-[11px] text-muted-foreground">
          <span>Dica: Use as setas ↑ ↓ para navegar e Enter para escolher</span>
          <span className="font-medium text-purple-900">Luluzinha</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
