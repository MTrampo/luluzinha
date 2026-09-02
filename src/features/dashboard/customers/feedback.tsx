import Header from "@/components/header/dashboard";
import { ErrorState } from "@/components/errors/error-state";
import { CustomSheet } from "@/components/sheets/custom-sheet";
import { CustomerForm } from "@/components/forms/customer-form";
import { Button } from "@/components/ui/button";
import { FaUserPlus } from "react-icons/fa6";
import { ToastError } from "@/components/errors/toast-error";

export const CustomerFeedbackEmpty = () => {
  return (
    <>
      <Header title="Poderosas" />
      <div className="main-content">
        <ErrorState
          type="empty"
          title="Nenhuma Poderosa encontrada"
          description="Você ainda não possui clientes cadastradas. Vamos cadastrar a sua primeira Poderosa?"
          action={
            <CustomSheet
              title="Nova Poderosa"
              description="Preencha os dados abaixo para cadastrar uma nova cliente."
              trigger={
                <Button size='sm'>
                  <FaUserPlus />
                  Nova Poderosa
                </Button>
              }
            >
              <CustomerForm />
            </CustomSheet>
          }
        />
      </div>
    </>
  );
}

type CustomerFeedbackErrorProps = {
  message: string;
}

export const CustomerFeedbackError = ({ message }: CustomerFeedbackErrorProps) => {
  return (
    <>
      <ToastError message={message} />
      <Header title="Poderosas" />
      <div className="main-content">
        <ErrorState
          type="error"
          title="Ops! Algo deu errado"
          description="Não foi possível carregar a lista de clientes no momento. Tente recarregar a página."
        />
      </div>
    </>
  );
}

export const CustomerFeedbackSearchNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 mt-6">
      <ErrorState
        type="search-not-found"
        title="Nenhum resultado encontrado"
        description="Não encontramos nenhuma Poderosa com o termo pesquisado."
      />
    </div>
  );
}
