'use client';

import { useState } from 'react';
import { usePwaInstall } from '@/commons/hooks/use-pwa-install';
import { IosGuideDialog } from './ios-guide-dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, X } from 'lucide-react';
import Image from 'next/image';

export function InstallBanner() {
  const { canInstall, isIOS, isDesktop, installDescription, installApp, dismissBanner } = usePwaInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (!canInstall) {
    return null;
  }

  const handleAction = async () => {
    if (isIOS) {
      setShowIosGuide(true);
    } else {
      await installApp();
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-center gap-3.5 rounded-2xl border border-purple-100 bg-white/95 p-3.5 shadow-xl backdrop-blur-md sm:p-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-100 overflow-hidden">
            <Image
              src="/favicon-96x96.png"
              alt="Luluzinha"
              width={36}
              height={36}
              className="rounded-lg object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-foreground truncate">
                {isDesktop ? "Luluzinha no seu computador" : "Luluzinha no seu celular"}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {installDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleAction}
              className="h-9 gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </Button>

            <button
              onClick={dismissBanner}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              aria-label="Fechar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <IosGuideDialog open={showIosGuide} onOpenChange={setShowIosGuide} />
    </>
  );
}
