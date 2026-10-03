'use client';

import { useProfileStore } from '@/store/use-profile';
import { SunMedium, Sparkles, MoonStar } from 'lucide-react';

export function GreetingBanner() {
  const luluzinha = useProfileStore((state) => state.luluzinha);
  const hour = new Date().getHours();

  let greeting = 'Bom dia';
  let message = 'Tudo pronto para cuidar das suas Poderosas hoje?';
  let Icon = SunMedium;

  if (hour >= 12 && hour < 18) {
    greeting = 'Boa tarde';
    message = 'Desejamos uma tarde leve e produtiva no Seu Espaço.';
    Icon = Sparkles;
  } else if (hour >= 18) {
    greeting = 'Boa noite';
    message = 'Mais um dia de dedicação e trabalho impecável.';
    Icon = MoonStar;
  }

  return (
    <div className="flex items-center gap-3 p-4 mb-4 rounded-2xl bg-purple-50/60 border border-purple-100/80 transition-all">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-primary shadow-xs">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-purple-950 truncate">
          {greeting}, {luluzinha || 'Poderosa'}!
        </h2>
        <p className="text-xs text-purple-900/70 truncate">
          {message}
        </p>
      </div>
    </div>
  );
}
