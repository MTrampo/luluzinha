"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { APP_VERSION, APP_STAGE } from "@/commons/constants/app"
import { RELEASES } from "@/commons/constants/changelog"
import { IoSparklesSharp } from "react-icons/io5"
import { CheckCircle2, Calendar, ArrowRight } from "lucide-react"

interface VersionNewsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VersionNewsDialog({ open, onOpenChange }: VersionNewsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border border-purple-100/80 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-purple-950/10 gap-6">
        {/* Cabeçalho Limpo */}
        <DialogHeader className="text-left space-y-1.5 pt-1">
          <DialogTitle className="text-xl sm:text-2xl font-black text-purple-950 font-lexend tracking-tight leading-tight">
            Novidades e Atualizações
          </DialogTitle>
          <DialogDescription className="text-purple-900/65 text-sm font-normal leading-relaxed">
            Acompanhe as melhorias preparadas para deixar seu dia a dia mais organizado e profissional.
          </DialogDescription>
        </DialogHeader>

        {/* Container Rolável Nativo do Shadcn */}
        <div className="-mx-4 max-h-[50vh] overflow-y-auto px-4 space-y-4">
          {RELEASES.map((release) => {
            const isCurrent = release.version === APP_VERSION

            return (
              <div
                key={release.version}
                className={`p-4 sm:p-4.5 rounded-2xl border transition-all space-y-3 ${isCurrent
                  ? "bg-purple-50/50 border-purple-200/80 shadow-xs"
                  : "bg-neutral-50/60 border-neutral-200/60"
                  }`}
              >
                {/* Cabeçalho da Release: Versão, Badge Atual e Data */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-lexend">
                      v{release.version}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-600 text-white font-lexend">
                        Atual
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-purple-900/60 flex items-center gap-1.5 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-purple-500" />
                    {release.date}
                  </span>
                </div>

                {/* Título Temático da Versão */}
                <h4 className="text-sm sm:text-base font-bold text-purple-950 font-lexend leading-snug">
                  {release.title}
                </h4>

                {/* Lista de Destaques / Melhorias */}
                <ul className="space-y-2 pt-0.5">
                  {release.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-purple-950/80 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Rodapé e Ação */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-purple-100/60">
          <span className="text-[11px] text-purple-900/40 font-medium order-last sm:order-first">
            Luluzinha • Seu Espaço Digital
          </span>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full px-6 py-2.5 shadow-md shadow-purple-200/60 text-sm transition-all active:scale-95"
          >
            Aproveitar Novidades
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
