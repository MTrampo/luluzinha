"use client"

import { useTransition } from "react"
import { FaEllipsisVertical, FaTrashCan } from "react-icons/fa6"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { BlockFormatted } from "@/commons/models/schedule"
import { deleteScheduleBlockAction } from "@/actions/schedule-blocks"
import { toast } from "sonner"
import { HttpStatusEnum } from "@/commons/enums/http"
import { Loader2 } from "lucide-react"

interface BlockMenuProps {
  block: BlockFormatted;
}

export function BlockMenu({ block }: BlockMenuProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();

    startTransition(async () => {
      const response = await deleteScheduleBlockAction(block.id);

      if (response.status === HttpStatusEnum.Ok) {
        toast.success("Horário liberado com sucesso!");
      } else {
        toast.error("Erro ao remover bloqueio.");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-purple-600 hover:bg-purple-50 data-[state=open]:text-purple-600 data-[state=open]:bg-purple-50 rounded-md transition-colors shrink-0"
          onClick={(e) => e.stopPropagation()}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
          ) : (
            <FaEllipsisVertical className="w-4 h-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-md transition-colors focus:bg-red-50 focus:text-red-700"
          onClick={handleDelete}
          disabled={isPending}
        >
          <FaTrashCan className="w-4 h-4 text-red-600" />
          <span className="font-medium">Remover Bloqueio</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
