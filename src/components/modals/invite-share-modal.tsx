"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaDownload, FaShareNodes } from "react-icons/fa6";
import Image from "next/image";
import { toast } from "sonner";

interface InviteShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableDays: string[];
}

export function InviteShareModal({ isOpen, onClose, availableDays }: InviteShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (isOpen && availableDays.length > 0) {
      const params = new URLSearchParams({
        days: availableDays.join(','),
        v: Date.now().toString(), // Cache buster
      });
      setImageUrl(`/api/og/convite?${params.toString()}`);
      setIsLoading(true);
    }
  }, [isOpen, availableDays]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `convite-luluzinha-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download concluído!");
    } catch (error) {
      console.error("Erro ao baixar imagem:", error);
      toast.error("Não foi possível baixar a imagem.");
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const absoluteUrl = `${window.location.origin}${imageUrl}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "horarios.png", { type: "image/png" });

      if (globalThis.navigator.share && globalThis.navigator.canShare && globalThis.navigator.canShare({ files: [file] })) {
        await globalThis.navigator.share({
          files: [file],
          title: "Meus Horários Disponíveis",
          text: "Poderosa, reserve seu momento de brilho! ✨",
        });
      } else {
        await globalThis.navigator.clipboard.writeText(absoluteUrl);
        toast.success("Link da imagem copiado! Só colar no WhatsApp.");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Não foi possível compartilhar a imagem.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] bg-white border-purple-100 rounded-3xl overflow-hidden p-0 gap-0">
        <div className="bg-purple-50/50 px-6 py-6 border-b border-purple-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-purple-900 leading-tight">
              Sua vitrine está pronta!
            </DialogTitle>
            <DialogDescription className="text-purple-600/70 font-medium m-0">
              Compartilhe seus horários livres e atraia mais Poderosas.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="relative aspect-9/16 w-full max-w-[240px] rounded-2xl overflow-hidden shadow-xl border-[6px] border-white ring-1 ring-purple-100 bg-purple-50">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-3 border-purple-100 border-t-purple-600 animate-spin" />
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Desenhando...</span>
                </div>
              </div>
            )}
            <Image
              src={imageUrl}
              alt="Preview do Convite"
              fill
              className={`object-cover transition-opacity duration-500 ${isLoading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setIsLoading(false)}
              unoptimized
            />
          </div>

          <div className="flex flex-col gap-3 w-full mt-8">
            <Button
              onClick={handleShare}
              disabled={isLoading || isSharing}
              className="bg-linear-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold h-14 shadow-lg shadow-purple-200 gap-3 text-base transition-all active:scale-95"
            >
              <FaShareNodes className="w-5 h-5" />
              {isSharing ? "Preparando..." : "Compartilhar Agora"}
            </Button>

            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isLoading}
              className="border-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white hover:border-purple-600 font-bold h-12 gap-2 text-sm transition-all active:scale-95 duration-300 ease-in-out"
            >
              <FaDownload className="w-4 h-4" />
              Baixar para a Galeria
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50/50 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Compartilhe no stories do instagram ou no status do WhatsApp!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
