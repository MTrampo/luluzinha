"use client"

import { CardFinance } from "../card";
import { PercentageBadge } from "../percentage";
import { FaChartLine, FaUsers, FaCalendarCheck, FaMoneyBillTrendUp } from "react-icons/fa6";
import { FinanceOverviewData } from "@/back/finance/service/finance.api";

type OverviewProps = {
  data: FinanceOverviewData;
}

export function Overview({ data }: OverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CardFinance
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
        percentage={(
          <PercentageBadge
            status='LOW'
            statusText='Hoje'
          />
        )}
      />
      <CardFinance
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
        percentage={(
          <PercentageBadge
            status='LOW'
            statusText='Hoje'
          />
        )}
      />
      <CardFinance
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
        percentage={(
          <PercentageBadge
            status='LOW'
            statusText='Mês'
          />
        )}
      />
      <CardFinance
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
        percentage={(
          <PercentageBadge
            status='LOW'
            statusText='Mês'
          />
        )}
      />
    </div>
  )
}