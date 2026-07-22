"use client"

import { CardFinance } from "../card";
import { PercentageBadge } from "../percentage";
import { FaChartLine, FaUsers, FaCalendarCheck, FaMoneyBillTrendUp } from "react-icons/fa6";
import { FinanceOverviewData } from "@/back/finance/service/finance.api";

type OverviewProps = {
  data: FinanceOverviewData;
}

export function Overview({ data }: OverviewProps) {
  const cardClassName = "snap-center snap-always shrink-0 w-[calc(100vw-48px)] max-[374px]:w-[calc(100vw-16px)] md:w-[320px] xl:w-auto xl:shrink"

  return (
    <div className="flex xl:grid xl:grid-cols-4 gap-6 overflow-x-auto xl:overflow-x-visible scrollbar-hide snap-x snap-mandatory scroll-smooth py-4 px-6 max-[374px]:px-2 md:px-0 -mx-6 max-[374px]:-mx-2 md:mx-0 xl:mx-0 xl:px-0 w-full">
      <CardFinance
        title="Projetados (Hoje)"
        className={cardClassName}
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
        title="Atendidas (Hoje)"
        className={cardClassName}
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
        title="Atendimentos (Mês)"
        className={cardClassName}
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
        title="Ganhos (Mês)"
        className={cardClassName}
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
    </div>
  )
}