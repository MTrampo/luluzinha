"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomSheet } from "@/components/sheets/custom-sheet"
import { CustomerForm } from "@/components/forms/customer-form"
import { FaUserPlus } from "react-icons/fa6"

export function NewCustomerButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="theme"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="font-bold gap-2 shadow-xs shrink-0 rounded-lg h-9 px-3 sm:px-3.5"
        title="Nova Poderosa"
        aria-label="Nova Poderosa"
      >
        <FaUserPlus className="text-xs" />
        <span className="hidden sm:inline text-xs sm:text-sm">Nova Poderosa</span>
      </Button>

      <CustomSheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Nova Poderosa"
        description="Preencha os dados abaixo para cadastrar uma nova cliente."
      >
        <CustomerForm onSuccess={() => setIsOpen(false)} />
      </CustomSheet>
    </>
  )
}
