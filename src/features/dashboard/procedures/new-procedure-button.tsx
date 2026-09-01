"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomSheet } from "@/components/sheets/custom-sheet"
import { ProcedureForm } from "@/components/forms/procedure-form"
import { FaHeartCirclePlus } from "react-icons/fa6"

export function NewProcedureButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="theme"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="font-bold gap-2 shadow-xs shrink-0 rounded-lg h-9 px-3 sm:px-3.5"
        title="Novo Procedimento"
        aria-label="Novo Procedimento"
      >
        <FaHeartCirclePlus className="text-xs" />
        <span className="hidden sm:inline text-xs sm:text-sm">Novo Procedimento</span>
      </Button>

      <CustomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Novo Procedimento"
        description="Preencha os dados abaixo para cadastrar um novo procedimento."
      >
        <ProcedureForm onSuccess={() => setIsOpen(false)} />
      </CustomSheet>
    </>
  )
}
