"use client"

import { StepperHeader, StepItem } from "@/components/stepper";
import { FaCircleCheck, FaArrowRight, FaArrowLeft, FaArrowsRotate } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { CustomerFormatted } from "@/commons/models/customer";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { EstablishmentFormatted } from "@/commons/models/establishment";
import { createScheduleAction } from "@/actions/schedule";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ScheduleStatusEnum } from "@/commons/enums/schedule";
import { calculateScheduleTotals, calculateScheduleDates } from "@/commons/utils/schedule";
import {
  SelectCustomerForm,
  SelectProceduresForm,
  SelectDateTimeForm,
  AppointmentSummary,
  Scoped,
  useStepper
} from "./appointment-steps";

interface NewAppointmentProps {
  customers: CustomerFormatted[];
  procedures: ProcedureFormatted[];
  activeEstablishment: EstablishmentFormatted | null;
}

interface StepperMetadata {
  customer?: { customerId: string };
  procedures?: { procedureIds: string[] };
  datetime?: { date: Date; time: string };
}



export function NewAppointment({ customers, procedures, activeEstablishment }: NewAppointmentProps) {
  return (
    <Scoped>
      <StepperContent customers={customers} procedures={procedures} activeEstablishment={activeEstablishment} />
    </Scoped>
  )
}

function StepperContent({ customers, procedures, activeEstablishment }: NewAppointmentProps) {
  const [isPending, startTransition] = useTransition();
  const stepper = useStepper();
  const router = useRouter();

  useEffect(() => {
    const draftStr = sessionStorage.getItem("appointment-draft");
    if (draftStr) {
      try {
        const draft = JSON.parse(draftStr);
        if (draft.customer) stepper.metadata.set("customer", draft.customer);
        if (draft.procedures) stepper.metadata.set("procedures", draft.procedures);
        if (draft.datetime) {
          stepper.metadata.set("datetime", {
            ...draft.datetime,
            date: draft.datetime.date ? new Date(draft.datetime.date) : undefined
          });
        }
      } catch (e) {
        console.error("Erro ao ler rascunho", e);
      }
    }
  }, []);

  const saveDraftToSession = () => {
    const draft = {
      customer: stepper.metadata.get("customer"),
      procedures: stepper.metadata.get("procedures"),
      datetime: stepper.metadata.get("datetime"),
    };
    sessionStorage.setItem("appointment-draft", JSON.stringify(draft));
  };

  const isNextDisabled = () => {
    const currentStepId = stepper.state.current.data.id;

    if (currentStepId === "customer") {
      const data = stepper.metadata.get("customer") as StepperMetadata["customer"];
      return !data?.customerId;
    }

    if (currentStepId === "procedures") {
      const data = stepper.metadata.get("procedures") as StepperMetadata["procedures"];
      return !data?.procedureIds || data.procedureIds.length === 0;
    }

    if (currentStepId === "datetime") {
      const data = stepper.metadata.get("datetime") as StepperMetadata["datetime"];
      return !data?.date || !data?.time;
    }

    return false;
  };

  const handleFinish = () => {
    if (!activeEstablishment) {
      toast.error("Estabelecimento não encontrado.");
      return;
    }

    const customerData = stepper.metadata.get("customer") as StepperMetadata["customer"];
    const proceduresData = stepper.metadata.get("procedures") as StepperMetadata["procedures"];
    const datetimeData = stepper.metadata.get("datetime") as StepperMetadata["datetime"];

    if (!customerData?.customerId || !proceduresData?.procedureIds || !datetimeData?.date || !datetimeData?.time) {
      toast.error("Por favor, preencha todos os dados.");
      return;
    }

    const { selectedProcedures, totalDuration, totalPrice } = calculateScheduleTotals(
      proceduresData.procedureIds,
      procedures
    );

    const { startAt, endAt } = calculateScheduleDates(
      datetimeData.date,
      datetimeData.time,
      totalDuration
    );

    startTransition(async () => {
      try {
        const res = await createScheduleAction({
          establishment_id: activeEstablishment.id,
          customer_id: customerData.customerId,
          start_at: startAt.toISOString(),
          end_at: endAt.toISOString(),
          status: ScheduleStatusEnum.CONFIRMED,
          total_duration: totalDuration,
          total_price: totalPrice,
          notes: null
        }, selectedProcedures.map(p => ({
          procedure_id: p.id,
          price_at_time: p.price,
          duration_at_time: p.duration
        })));

        if (res.status === 201 || res.status === 200) {
          toast.success("Agendamento criado com sucesso!");
          sessionStorage.removeItem("appointment-draft");
          router.push("/painel/agenda");
          router.refresh();
        } else {
          toast.error(res.message || "Erro ao criar agendamento.");
        }
      } catch (error) {
        toast.error("Ocorreu um erro inesperado ao salvar o agendamento.");
        console.error(error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 pt-8 animate-in fade-in duration-700">
      <StepperHeader
        steps={stepper.state.all as unknown as StepItem[]}
        currentStepId={stepper.state.current.data.id}
      />

      <div className="min-h-[400px]">
        {stepper.flow.switch({
          "customer": () => (
            <SelectCustomerForm
              customers={customers}
              initialSelectedId={(stepper.metadata.get("customer") as StepperMetadata["customer"])?.customerId}
              onSelect={(id) => stepper.metadata.set("customer", { customerId: id })}
            />
          ),
          "procedures": () => (
            <SelectProceduresForm
              procedures={procedures}
              initialSelected={(stepper.metadata.get("procedures") as StepperMetadata["procedures"])?.procedureIds || []}
              onSelect={(ids) => stepper.metadata.set("procedures", { procedureIds: ids })}
            />
          ),
          "datetime": () => (
            <SelectDateTimeForm
              activeEstablishment={activeEstablishment}
              procedures={procedures}
              selectedProcedureIds={(stepper.metadata.get("procedures") as StepperMetadata["procedures"])?.procedureIds || []}
              initialSelectedDate={(stepper.metadata.get("datetime") as StepperMetadata["datetime"])?.date}
              initialSelectedTime={(stepper.metadata.get("datetime") as StepperMetadata["datetime"])?.time}
              onSelect={(date, time) => stepper.metadata.set("datetime", { date, time })}
            />
          ),
          "summary": () => (
            <AppointmentSummary
              customers={customers}
              procedures={procedures}
              customerId={(stepper.metadata.get("customer") as StepperMetadata["customer"])?.customerId}
              procedureIds={(stepper.metadata.get("procedures") as StepperMetadata["procedures"])?.procedureIds || []}
              selectedDate={(stepper.metadata.get("datetime") as StepperMetadata["datetime"])?.date}
              selectedTime={(stepper.metadata.get("datetime") as StepperMetadata["datetime"])?.time}
            />
          ),
        })}
      </div>

      <div className="flex justify-end gap-2 items-center pb-12">
        <Button
          variant="outline"
          onClick={() => {
            saveDraftToSession();
            stepper.navigation.prev();
          }}
          disabled={stepper.state.isFirst}
          className="border-purple-200 text-purple-700 hover:bg-purple-50 font-bold"
        >
          <FaArrowLeft /> Voltar
        </Button>
        {stepper.state.isLast ? (
          <Button
            variant="success"
            onClick={handleFinish}
            disabled={isPending}
            className="shadow-md hover:shadow-lg transition-all"
          >
            {isPending ? (
              <>
                <FaArrowsRotate className="animate-spin" /> Agendando...
              </>
            ) : (
              <>
                <FaCircleCheck /> Agendar Atendimento
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => {
              saveDraftToSession();
              stepper.navigation.next();
            }}
            disabled={stepper.state.isLast || isNextDisabled()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold disabled:bg-purple-300 disabled:opacity-100 shadow-md hover:shadow-lg transition-all"
          >
            Avançar <FaArrowRight />
          </Button>
        )}
      </div>
    </div>
  )
}
