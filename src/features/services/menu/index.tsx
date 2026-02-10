import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FaEllipsisVertical, FaPen, FaTrashCan } from "react-icons/fa6";

export function ActionMenu() {  
  return(
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <FaEllipsisVertical/>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          Ações
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem className="cursor-pointer">
          <FaPen />
          Editar procedimento
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" variant='destructive'>
          <FaTrashCan />
          Excluir procedimento
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}