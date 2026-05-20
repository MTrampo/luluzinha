"use client"

import { useState } from "react"
import { FaLock } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BlockTimeForm } from "@/components/forms/block-time-form"
import { BlocksList } from "../blocks-list"

interface BlocksTabProps {
  establishmentId: string
}

export function BlocksTab({ establishmentId }: BlocksTabProps) {
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [blocksRefreshKey, setBlocksRefreshKey] = useState(0)

  return (
    <div className="border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-purple-50 pb-3 gap-2">
        <div>
          <h3 className="text-lg font-bold text-purple-900">Gestão de Disponibilidade</h3>
          <p className="text-xs text-gray-500 mt-1">
            Visualize e gerencie os horários que você reservou como bloqueados na sua agenda de atendimentos.
          </p>
        </div>

        <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="border-purple-150 text-purple-700 hover:bg-purple-50/50 hover:text-purple-800 transition-all rounded-lg flex items-center gap-2"
            >
              <FaLock className="text-xs" />
              Bloquear Horário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-purple-100 bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-purple-900 font-black text-xl">
                <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <FaLock className="text-sm" />
                </div>
                Bloquear Horário
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-xs">
                Escolha um motivo e o período para pausar os atendimentos.
              </DialogDescription>
            </DialogHeader>
            <BlockTimeForm
              selectedDate={new Date()}
              onSuccess={() => {
                setIsBlockDialogOpen(false)
                setBlocksRefreshKey((prev) => prev + 1)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <BlocksList 
        key={blocksRefreshKey} 
        establishmentId={establishmentId} 
        onAddBlock={() => setIsBlockDialogOpen(true)}
      />
    </div>
  )
}
