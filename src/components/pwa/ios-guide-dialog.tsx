'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface IosGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IosGuideDialog({ open, onOpenChange }: IosGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-purple-100 p-6 sm:p-8">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Seu Espaço na palma da mão</span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Como instalar no seu iPhone
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            O Luluzinha funciona como um aplicativo real, sem precisar baixar na App Store. Siga estes 3 passinhos rápidos:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs text-primary">
              <Share className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">1. Toque em Compartilhar</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Na barra inferior do seu navegador Safari, toque no ícone de compartilhamento (o quadrado com uma seta para cima).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs text-primary">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">2. Adicionar à Tela de Início</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Role o menu de opções para baixo e selecione a opção <span className="font-medium text-foreground">"Adicionar à Tela de Início"</span>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/60 border border-purple-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs text-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-foreground">3. Confirmar e Brilhar</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Toque em <span className="font-medium text-foreground">"Adicionar"</span> no canto superior direito. Pronto! O ícone estará salvo no seu celular.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl h-11"
        >
          Entendido, vou adicionar!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
