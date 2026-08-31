"use client"

import { CardFinance } from "../card";
import { PercentageBadge } from "../percentage";
import { FaChartLine, FaUsers, FaCalendarCheck, FaMoneyBillTrendUp } from "react-icons/fa6";
import { FinanceOverviewData } from "@/back/finance/service/finance.api";

type OverviewProps = {
  data: FinanceOverviewData;
}

export function Overview({ data }: OverviewProps) {
  const cardItemClass = "w-[72vw] min-w-[230px] max-w-[275px] shrink-0 snap-start sm:w-full sm:min-w-0 sm:max-w-none sm:shrink";

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 gap-3.5 pt-2 pb-2 touch-pan-x sm:grid sm:grid-cols-2 xl:grid-cols-4 sm:gap-4 sm:overflow-visible sm:py-0 w-auto sm:w-full scroll-px-4">
      <CardFinance
        className={cardItemClass}
        title="Projetados (Hoje)"
        helpText="Valor total estimado dos atendimentos agendados para hoje. Este valor inclui atendimentos confirmados e finalizados."
        icon={FaCalendarCheck}
        description={(
          <p>
            Estimativa baseada nos atendimentos de hoje.
          </p>
        )}
        amount={data.projectedDay}
        last='Baseado na agenda de hoje'
      />
      <CardFinance
        className={cardItemClass}
        title="Atendidas (Hoje)"
        helpText="Quantidade de poderosas que já tiveram seus atendimentos concluídos hoje."
        icon={FaUsers}
        description={(
          <p>
            Poderosas com atendimentos finalizados hoje.
          </p>
        )}
        amount={data.completedDayCount}
        last='Baseado na agenda de hoje'
      />
      <CardFinance
        className={cardItemClass}
        title="Atendimentos (Mês)"
        helpText="Contagem total de atendimentos realizados e finalizados desde o início do mês."
        icon={FaChartLine}
        description={(
          <p>
            Total de atendimentos concluídos este mês.
          </p>
        )}
        amount={data.completedMonthCount}
        last='Baseado no mês atual'
      />
      <CardFinance
        className={cardItemClass}
        title="Ganhos (Mês)"
        helpText="Soma dos valores de todos os atendimentos que você já finalizou neste mês."
        icon={FaMoneyBillTrendUp}
        description={(
          <p>
            Valor dos atendimentos finalizados no mês.
          </p>
        )}
        amount={data.completedMonthValue}
        last='Baseado no mês atual'
      />
      <div className="w-1 shrink-0 sm:hidden" aria-hidden="true" />
    </div>
  )
}