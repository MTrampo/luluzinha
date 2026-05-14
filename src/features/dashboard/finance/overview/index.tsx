import { CardFinance } from "../card";
import { PercentageBadge } from "../percentage";
import { FaChartLine, FaUsers, FaCalendarCheck, FaMoneyBillTrendUp } from "react-icons/fa6";

export function Overview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CardFinance
        title="Projetados"
        helpText="Valor total estimado dos atendimentos agendados para hoje. Este valor pode variar caso ocorram desistências ou alterações nos atendimentos."
        icon={FaCalendarCheck}
        description={(
          <p>
            Estimativa baseada nos atendimentos de hoje.
          </p>
        )}
        amount='R$ 350,00'
        last='03/02 ás 14:00'
        percentage={(
          <PercentageBadge
            status='LOW'
            statusText='0%'
          />
        )}
      />
      <CardFinance
        title="Atendidos"
        helpText="Quantidade de poderosas que já tiveram seus atendimentos concluídos hoje."
        icon={FaUsers}
        description={(
          <p>
            Poderosas com atendimentos finalizados hoje.
          </p>
        )}
        amount='4'
        last='03/02 ás 14:00'
        percentage={(
          <PercentageBadge
            status='LOW'
            statusText='0%'
          />
        )}
      />
      <CardFinance
        title="Procedimentos"
        helpText="Contagem total de atendimentos realizados e finalizados desde o início do mês."
        icon={FaChartLine}
        description={(
          <p>
            Total de atendimentos concluídos este mês.
          </p>
        )}
        amount='15'
        last='Sem registro da última entrada'
        percentage={(
          <PercentageBadge
            status='LOW'
            statusText='0%'
          />
        )}
      />
      <CardFinance
        title="Ganhos"
        helpText="Soma dos valores de todos os atendimentos que você já finalizou neste mês."
        icon={FaMoneyBillTrendUp}
        description={(
          <p>
            Valor dos atendimentos finalizados no mês.
          </p>
        )}
        amount='R$ 3.070,43'
        last='Sem registro da última entrada'
        percentage={(
          <PercentageBadge
            status='LOW'
            statusText='0%'
          />
        )}
      />
    </div>
  )
}