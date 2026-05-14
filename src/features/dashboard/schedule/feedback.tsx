import { ErrorState } from "@/components/errors/error-state";

export const ScheduleFeedbackEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 mt-6">
      <ErrorState
        type="empty"
        title="Nenhum atendimento por aqui ainda"
        description="Sua bancada está livre! Que tal aproveitar para planejar o próximo brilho?"
      />
    </div>
  );
}

export const ScheduleFeedbackSearchNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 mt-6">
      <ErrorState
        type="search-not-found"
        title="Nenhum agendamento encontrado"
        description="Não encontramos nenhum atendimento para esta data ou termo pesquisado."
      />
    </div>
  );
}
