"use client"

import { CustomerFormatted } from "@/commons/models/customer";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaUser, FaPaintbrush, FaCalendarCheck, FaClock, FaMoneyBillWave } from "react-icons/fa6";
import { formatCurrencyBRL, formatDuration } from "@/commons/utils/format";
import { StandardAvatar } from "@/components/avatar";

export function AppointmentSummary({
  customers,
  procedures,
  customerId,
  procedureIds,
  selectedDate,
  selectedTime,
}: {
  customers: CustomerFormatted[];
  procedures: ProcedureFormatted[];
  customerId?: string;
  procedureIds?: string[];
  selectedDate?: Date;
  selectedTime?: string;
}) {
  const customer = customers.find(c => c.id === customerId);
  const selectedProcedures = procedures.filter(p => procedureIds?.includes(p.id));

  const totalDuration = selectedProcedures.reduce((acc, p) => acc + p.duration, 0);
  const totalPrice = selectedProcedures.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 mx-auto pb-8">

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-gray-500 pl-1 flex items-center gap-2">
            <FaUser /> Poderosa
          </p>
          <div className="flex items-center gap-4 rounded-xl border border-purple-100 bg-white p-4 shadow-sm relative overflow-hidden">
            <StandardAvatar initials={customer?.initials || "?"} className="h-12 w-12 border border-purple-50 shadow-sm" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-bold truncate text-base text-gray-800">
                {customer?.nameFormatted || "Nenhuma selecionada"}
              </span>
              {customer?.phoneFormatted && (
                <span className="text-xs font-semibold text-gray-500 mt-0.5">
                  {customer.phoneFormatted}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-gray-500 pl-1 flex items-center gap-2">
            <FaCalendarCheck /> Quando?
          </p>
          <div className="flex items-center gap-4 rounded-xl border border-purple-100 bg-white p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-center bg-purple-50 w-12 h-12 rounded-xl text-purple-600 font-black text-xl border border-purple-100/50">
              <FaClock size={20} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              {selectedDate && selectedTime ? (
                <>
                  <span className="font-bold truncate text-base text-gray-800 capitalize leading-none">
                    {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  <span className="text-sm font-bold text-purple-600 mt-1.5">
                    às {selectedTime}
                  </span>
                </>
              ) : (
                <span className="font-bold truncate text-base text-red-500">
                  Data ou hora pendente
                </span>
              )}
            </div>
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-gray-500 pl-1 flex items-center gap-2">
          <FaPaintbrush /> O que vamos fazer?
        </p>
        {selectedProcedures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedProcedures.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl border border-purple-100 bg-white p-3 shadow-sm relative overflow-hidden">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold text-gray-800 truncate text-[0.95rem] capitalize leading-none mb-1">
                    {p.nameFormatted}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 mt-0.5 flex gap-1 items-center">
                    <FaClock size={12} /> {formatDuration(p.duration)}
                  </span>
                </div>
                <div className="text-right pl-2">
                  <p className="text-purple-700 font-black tracking-tight">{p.priceFormatted}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500 font-bold text-sm bg-red-50 p-4 rounded-xl border border-red-200">
            Nenhum serviço selecionado
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-purple-500 p-5 rounded-2xl shadow-md text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -top-4 -right-4 p-4 opacity-10 -rotate-12">
            <FaClock size={80} />
          </div>

          <div className="flex flex-col relative z-10 w-full">
            <div className="text-[0.65rem] font-bold text-pink-200 uppercase tracking-widest mb-1.5 flex items-center justify-between">
              <span>Tempo Estimado</span>
            </div>
            <p className="font-black text-2xl tracking-tighter leading-none">{formatDuration(totalDuration)}</p>
          </div>
        </div>

        <div className="bg-purple-700 p-5 rounded-2xl shadow-md text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12">
            <FaMoneyBillWave size={80} />
          </div>

          <div className="flex flex-col relative z-10 w-full">
            <div className="text-[0.65rem] font-bold text-purple-200 uppercase tracking-widest mb-1.5 flex items-center justify-between">
              <span>Valor Estimado</span>
            </div>
            <p className="font-black text-2xl tracking-tighter leading-none">{formatCurrencyBRL(totalPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
