"use client"

import { useState, useTransition } from "react"
import { FaWhatsapp, FaEnvelope, FaPen, FaTrash } from "react-icons/fa"
import { FaCakeCandles } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { CustomSheet } from "@/components/sheets/custom-sheet"
import { CustomerForm } from "@/components/forms/customer-form"
import { CustomerFormatted } from "@/commons/models/customer"
import { deleteCustomerAction } from "@/actions/customer"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog"

interface CustomerDetailsSheetProps {
  customer: CustomerFormatted;
  children: React.ReactNode;
  className?: string;
}

export function CustomerDetailsSheet({ customer, children, className }: CustomerDetailsSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response = await deleteCustomerAction(customer.id);
        if (response.status === 200) {
          toast.success(response.message);
          setIsConfirmOpen(false);
          setIsOpen(false);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Ocorreu um erro ao excluir a Poderosa.");
      }
    });
  }

  return (
    <CustomSheet
      open={isOpen}
      onOpenChange={setIsOpen}
      title={customer.nameFormatted}
      description="Detalhes da Poderosa"
      trigger={children}
    >
      <div className="space-y-6 mt-4">
        <div className="space-y-2">
          {customer.waLink ? (
            <a 
              href={customer.waLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 transition-colors"
            >
              <FaWhatsapp className="text-green-600" />
              <span>{customer.phoneFormatted}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaWhatsapp className="text-gray-400" />
              <span>{customer.phoneFormatted}</span>
            </div>
          )}
          {customer.email && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaEnvelope className="text-gray-400" />
              <span>{customer.email}</span>
            </div>
          )}
          {customer.birthday && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaCakeCandles className="text-pink-500" />
              <span>{customer.birthdayFormatted}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900 border-b pb-1">Anotações Importantes</h4>
          <div className="p-3 rounded-md text-sm text-gray-700 min-h-24 whitespace-pre-wrap">
            {customer.notes || "Nenhuma anotação cadastrada para essa Poderosa."}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <CustomSheet
            title="Editar Poderosa"
            description="Altere os dados da Poderosa abaixo."
            trigger={
              <Button variant="outline" className="flex-1">
                <FaPen className="mr-2" /> Editar
              </Button>
            }
          >
            <CustomerForm customer={customer} onSuccess={() => setIsOpen(false)} />
          </CustomSheet>

          <Button variant="destructive" className="flex-1" disabled={isPending} onClick={() => setIsConfirmOpen(true)}>
            <FaTrash className="mr-2" /> Excluir
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Excluir Poderosa"
        description={
          <>
            Tem certeza que deseja excluir a cliente <strong>{customer.nameFormatted}</strong>? Esta ação não pode ser desfeita.
          </>
        }
        onConfirm={handleDelete}
        confirmText="Excluir"
      />
    </CustomSheet>
  )
}
