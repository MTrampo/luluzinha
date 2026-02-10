import { CardFinance } from "../card";
import { PercentageBadge } from "../percentage";

export function Overview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CardFinance 
        title="Projetados" 
        description={(
          <p>
            Soma de todos os procedimentos marcados para hoje que ainda não foram finalizados.
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
        description={(
          <p>
            Poderosas atendidas hoje
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
        description={(
          <p>
            Soma de todos os procedimentos realizados desde o dia 1º do mês atual.
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
        description={(
          <p>
            Soma de todos os procedimentos finalizados desde o dia 1º do mês atual.
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