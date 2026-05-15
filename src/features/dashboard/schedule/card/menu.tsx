"use client"

import { FaEllipsisVertical, FaWhatsapp, FaCalendarXmark, FaCalendarDays, FaPenToSquare, FaCalendarCheck } from "react-icons/fa6"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScheduleDash } from "@/commons/models/schedule"

interface MenuProps {
  schedule: ScheduleDash;
}

export function Menu({ schedule }: MenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:h-10 md:w-10 text-gray-500 hover:text-purple-600 hover:bg-purple-50 data-[state=open]:text-purple-600 data-[state=open]:bg-purple-50 rounded-md transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <FaEllipsisVertical className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {schedule.customer.waLink && (
          <DropdownMenuItem
            asChild
            className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-green-50 focus:text-green-700"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={schedule.customer.waLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="w-4 h-4 text-green-500" />
              <span className="font-medium">Chamar Poderosa</span>
            </a>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-green-50 focus:text-green-700"
          onClick={(e) => e.stopPropagation()}
        >
          <FaCalendarCheck className="w-4 h-4 text-green-600" />
          <span className="font-medium">Finalizar Atendimento</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-purple-50 focus:text-purple-700"
          onClick={(e) => e.stopPropagation()}
        >
          <FaPenToSquare className="w-4 h-4 text-purple-600" />
          <span className="font-medium">Editar Atendimento</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-red-50 focus:text-red-700"
          onClick={(e) => e.stopPropagation()}
        >
          <FaCalendarXmark className="w-4 h-4 text-red-600" />
          <span className="font-medium">Cancelar Atendimento</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
