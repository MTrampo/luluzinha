"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomSheet } from "@/components/sheets/custom-sheet"
import { ProcedureForm } from "@/components/forms/procedure-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FaHeartCirclePlus, FaCrown } from "react-icons/fa6"
import { LuSparkles } from "react-icons/lu"
import Link from "next/link"

interface NewProcedureButtonProps {
  canAddMore?: boolean
  totalCount?: number
  maxProcedures?: number
  planName?: string
}

export function NewProcedureButton({
  canAddMore = true,
  totalCount = 0,
  maxProcedures = 6,
  planName = "Fundadoras",
}: NewProcedureButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)

  const handleClick = () => {
    if (!canAddMore) {
      setIsLimitModalOpen(true)
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <Button
        variant="theme"
        size="sm"
        onClick={handleClick}
        className="font-bold gap-2 shadow-xs shrink-0 rounded-lg h-9 px-3 sm:px-3.5 cursor-pointer"
        title="Novo Procedimento"
        aria-label="Novo Procedimento"
      >
        <FaHeartCirclePlus className="text-xs" />
        <span className="hidden sm:inline text-xs sm:text-sm">Novo Procedimento</span>
      </Button>

      {/* Sheet de Criação Normal */}
      <CustomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Novo Procedimento"
        description="Preencha os dados abaixo para cadastrar um novo procedimento."
      >
        <ProcedureForm onSuccess={() => setIsOpen(false)} />
      </CustomSheet>

      {/* Modal Harmonioso de Limite Atingido */}
      <Dialog open={isLimitModalOpen} onOpenChange={setIsLimitModalOpen}>
        <DialogContent className="max-w-md bg-white border-purple-100 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-100 to-purple-200 text-purple-800 flex items-center justify-center mx-auto shadow-inner">
            <FaCrown className="w-6 h-6 text-purple-700" />
          </div>

          <DialogHeader className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-[11px] font-bold uppercase tracking-wider mx-auto w-fit">
              <LuSparkles className="w-3 h-3 text-amber-500" />
              Menu de Procedimentos Completo
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-purple-950">
              Limite de Procedimentos
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              Que orgulho ver seu espaço crescendo! Você atingiu o limite de <strong>{maxProcedures} procedimentos</strong> cadastrados no plano <strong>{planName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100 text-xs text-purple-900/80 leading-relaxed">
            Para adicionar novos procedimentos, você pode excluir serviços que não realiza mais ou conferir as opções de expansão do seu espaço digital.
          </div>

          <DialogFooter className="flex flex-col sm:flex-col gap-2 pt-2">
            <Button
              variant="theme"
              className="w-full font-bold text-sm h-11 rounded-xl"
              asChild
            >
              <Link href="/assinatura">
                Conhecer Opções de Expansão
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsLimitModalOpen(false)}
              className="w-full text-xs h-9 rounded-xl border-purple-200 text-purple-900"
            >
              Voltar ao Meu Espaço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
