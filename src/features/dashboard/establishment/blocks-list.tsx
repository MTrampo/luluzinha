'use client'

import { useEffect, useState } from "react"
import { listScheduleBlocksAction, deleteScheduleBlockAction } from "@/actions/schedule-blocks"
import { FaLock, FaTrashCan, FaCalendarCheck, FaClock, FaRepeat } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { HttpStatusEnum } from "@/commons/enums/http"
import { BlockRecurringTypeEnum } from "@/commons/enums/schedule"
import { BlockFormatted } from "@/commons/models/schedule"

const DAYS_OF_WEEK = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", 
  "Quinta-feira", "Sexta-feira", "Sábado"
]

interface BlocksListProps {
  establishmentId: string
  onAddBlock?: () => void
}

export function BlocksList({ establishmentId, onAddBlock }: BlocksListProps) {
  void establishmentId;
  const [blocks, setBlocks] = useState<BlockFormatted[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlocks = async () => {
    const response = await listScheduleBlocksAction()
    if (response.status === HttpStatusEnum.Ok) {
      setBlocks(response.data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    let isMounted = true;
    listScheduleBlocksAction().then((response) => {
      if (isMounted) {
        if (response.status === HttpStatusEnum.Ok) {
          setBlocks(response.data || [])
        }
        setLoading(false)
      }
    });
    return () => {
      isMounted = false;
    };
  }, [])


  const handleDelete = async (id: string) => {
    const response = await deleteScheduleBlockAction(id)
    if (response.status === HttpStatusEnum.Ok) {
      toast.success("Bloqueio removido com sucesso!")
      fetchBlocks()
    } else {
      toast.error("Erro ao remover bloqueio.")
    }
  }

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
        <span className="text-sm text-purple-400 font-medium">Buscando seus bloqueios...</span>
      </div>
    )
  }

  if (blocks.length === 0) {
    return (
      <div className="py-12 text-center flex flex-col items-center gap-4">
        <div className="h-20 w-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-300">
          <FaLock className="text-4xl" />
        </div>
        <div className="max-w-xs space-y-3">
          <div>
            <h5 className="text-purple-900 mb-1 font-bold text-lg">Nenhum bloqueio ativo</h5>
            <p className="text-sm text-gray-500 leading-relaxed">
              Sua agenda está totalmente disponível para as poderosas brilharem!
            </p>
          </div>
          {onAddBlock && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddBlock}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg font-bold"
            >
              Criar Primeiro Bloqueio
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-purple-50/30 text-[10px] uppercase tracking-[0.2em] text-purple-400 font-black">
            <th className="px-6 py-5">Motivo</th>
            <th className="px-6 py-5">Tipo / Data</th>
            <th className="px-6 py-5">Horário</th>
            <th className="px-6 py-5 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-50">
          {blocks.map((block) => (
            <tr key={block.id} className="group hover:bg-purple-50/20 transition-colors">
              <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-purple-100/50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <FaLock className="text-sm" />
                  </div>
                  <span className="text-sm font-bold text-purple-900">
                    {block.reason}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2.5 text-xs">
                  {block.recurringType === BlockRecurringTypeEnum.DAILY ? (
                    <div className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-full font-bold shadow-sm">
                      <FaRepeat className="text-[10px] animate-pulse" />
                      <span>Repete Diariamente</span>
                    </div>
                  ) : block.recurringType === BlockRecurringTypeEnum.WEEKLY ? (
                    <div className="flex items-center gap-2 bg-purple-100/30 text-purple-700 px-3 py-1.5 rounded-full font-semibold border border-purple-100">
                      <FaRepeat className="text-[10px]" />
                      <span>Toda {DAYS_OF_WEEK[block.dayOfWeek!]}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                      <FaCalendarCheck className="text-purple-400" />
                      <span>{block.date ? new Date(block.date).toLocaleDateString('pt-BR') : '-'}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-5 text-xs font-medium text-gray-600">
                <div className="flex items-center gap-2.5 bg-white border border-purple-50 px-3 py-1.5 rounded-lg w-fit">
                  <FaClock className="text-purple-400" />
                  <span>
                    {block.isAllDay ? "Dia Todo" : `${block.startTime} às ${block.endTime}`}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                  onClick={() => handleDelete(block.id)}
                >
                  <FaTrashCan className="text-sm" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
