import Header from "@/components/header/dashboard";
import { ErrorState } from "@/components/errors/error-state";
import { CustomSheet } from "@/components/sheets/custom-sheet";
import { ServiceForm } from "@/components/forms/service-form";
import { Button } from "@/components/ui/button";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { ToastError } from "@/components/errors/toast-error";

export const ProcedureFeedbackEmpty = () => {
  return (
    <>
      <Header title="Procedimentos" />
      <div className="main-content">
        <ErrorState
          type="empty"
          title="Nenhum procedimento encontrado"
          description="Luluzinha, você ainda não possui procedimentos cadastrados. Vamos cadastrar um novo?"
          action={
            <CustomSheet
              title="Novo Procedimento"
              description="Preencha os dados abaixo para cadastrar um novo procedimento."
              trigger={
                <Button size='sm'>
                  <FaHeartCirclePlus />
                  Novo Procedimento
                </Button>
              }
            >
              <ServiceForm />
            </CustomSheet>
          }
        />
      </div>
    </>
  );
}

type ProcedureFeedbackErrorProps = {
  message: string;
}

export const ProcedureFeedbackError = ({ message }: ProcedureFeedbackErrorProps) => {
  return (
    <>
      <ToastError message={message} />
      <Header title="Procedimentos" />
      <div className="main-content">
        <ErrorState
          type="error"
          title="Ops! Algo deu errado"
          description="Não foi possível carregar a lista de procedimentos no momento. Tente recarregar a página."
        />
      </div>
    </>
  );
}

export const ProcedureFeedbackSearchNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 mt-6">
      <ErrorState
        type="search-not-found"
        title="Nenhum resultado encontrado"
        description="Não encontramos nenhum procedimento com o termo pesquisado."
      />
    </div>
  );
}