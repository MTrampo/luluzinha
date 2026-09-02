"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FaEllipsisVertical, FaPen, FaTrashCan, FaBan, FaCircleCheck } from "react-icons/fa6";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { useState, useTransition } from "react";
import { CustomSheet } from "@/components/sheets/custom-sheet";
import { ProcedureForm } from "@/components/forms/procedure-form";
import { deleteProcedureAction, toggleProcedureActiveAction } from "@/actions/procedure";
import { toast } from "sonner";
import { HttpStatusEnum } from "@/commons/enums/http";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";

type CardActionMenuProps = {
  procedure: ProcedureFormatted;
}

export function CardActionMenu({ procedure }: CardActionMenuProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response = await deleteProcedureAction(procedure.id);
        if (response.status === HttpStatusEnum.Ok) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error("Ocorreu um erro ao excluir o procedimento.");
      } finally {
        setIsDeleteOpen(false);
      }
    });
  }

  const handleToggleActive = () => {
    startTransition(async () => {
      try {
        const response = await toggleProcedureActiveAction(procedure.id, !procedure.isActive);
        if (response.status === HttpStatusEnum.Ok) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error("Ocorreu um erro ao alterar o status do procedimento.");
      }
    });
  }


  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <FaEllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            Ações
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.preventDefault(); handleToggleActive(); }}>
            {procedure.isActive ? (
              <>
                <FaBan className="mr-2" />
                Desativar procedimento
              </>
            ) : (
              <>
                <FaCircleCheck className="mr-2" />
                Ativar procedimento
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditOpen(true)}>
            <FaPen className="mr-2" />
            Editar procedimento
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" variant='destructive' onClick={() => setIsDeleteOpen(true)}>
            <FaTrashCan className="mr-2" />
            Excluir procedimento
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomSheet
        title="Editar Procedimento"
        description="Altere os dados do procedimento abaixo e salve."
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      >
        <ProcedureForm procedure={procedure} onSuccess={() => setIsEditOpen(false)} />
      </CustomSheet>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Excluir Procedimento"
        description={
          <>
            Tem certeza que deseja excluir o procedimento <strong>{procedure.nameFormatted}</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </>
        }
        onConfirm={handleDelete}
        isPending={isPending}
        confirmText="Confirmar exclusão"
      />
    </>
  )
}