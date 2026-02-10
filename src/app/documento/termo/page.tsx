import Header from "@/components/header";

export default function TermsOfUse() {
  const lastUpdate = "05 de Fevereiro de 2026";
  const appName = "Luluzinha";

  return (
    <>
      <Header/>
      <div>
        <section className="mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl space-y-12">
          <div>
            <h1>Termos e Condições de Uso</h1>
            <p>
              A <strong>{appName}</strong> é um ecossistema de tecnologia voltado à <strong>gestão profissional para Prestadores de Serviço</strong>. 
              Nosso objetivo é fornecer ferramentas que automatizem processos e organizem o o cotidiano do seu negócio, permitindo que você foque no que realmente importa: o seu atendimento.
            </p>
            <p>
              Ao contratar a {appName}. você adquire uma licença de uso de software (SaaS), garantindo acesso a um conjunto de funcionalidades que podem incluir organização de agenda, gestão de base de clientes e outras soluções de produtividade,
              conforme as especificações do plano selecionado. Reservamo-nos o direito de evoluir e modificar essas ferramentas para garantir a constante modernização do serviço.
            </p>
            <p>
              Para fins destes Termos, as referências a &quot;você&quot; ou &quot;usuário&quot; referem-se ao Prestador de Serviço titular da conta e responsável pelo pagamento da assinatura. Ressaltamos que o {appName} atua exclusivamente como fornecedor de tecnologia de
              gestão; portanto, não intermediamos pagamentos entre você e seus clientes, não garantimos o cumprimento de agendas e não possuímos qualquer responsabilidade sobre a execução dos seus serviços ou sua relação comercial com terceiros.
            </p>
          </div>

          {/* 1. Aceite */}
          <div className="space-y-4">
            <h2>1. Aceite dos Termos</h2>
            <p>
              Ao cadastrar-se e utilizar o sistema, você concordam integralmente com estas normas. Este sistema está sob responsabilidade do desenvolvedor, ora identificado como Pessoa Física, com foro eleito na cidade de São Paulo/SP.
            </p>
          </div>

          {/* 2. Natureza do Serviço - Destaque de Segurança */}
          <div className="space-y-4">
            <h2>2. Natureza do Serviço e Isenção Financeira</h2>
            <p>
              O serviço é estritamente uma ferramenta de GESTÃO e ORGANIZAÇÃO. A {appName} é utilizado por sua conta e risco, sem garantias de resultados comerciais ou operacionais. O sistema não é responsável por falhas técnicas,
              indisponibilidade ou qualquer impacto financeiro decorrente do uso da plataforma.
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-3">
              <li><strong>Sem Responsabilidade Financeira:</strong> Não nos responsabilizamos por perdas financeiras, lucros cessantes ou danos decorrentes do seu uso do software.</li>
              <li><strong>Independência de Relação:</strong> Não interferimos na relação entre você e seus clientes. O sistema não é responsável por faltas, cancelamentos de última hora ou inadimplência de terceiros.</li>
              <li><strong>Falhas Técnicas:</strong> Eventos inesperados (quedas de servidores ou erros de provedores externos) não geram direito a indenizações</li>
            </ul>
          </div>

          {/* 3. Assinaturas */}
          <div className="space-y-4">
            <h2>3. Assinaturas e Processamento de Pagamento</h2>
            <p>
              O pagamento e processamento das mensalidades é gerido de forma automatizada via <strong>Mercado Pago</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Cobrança:</strong> Seguimos as políticas de retentativas do provedor (podem variar entre o dia da falha, 3 dias após a falha, 7 dias após a falha e até 30 dias).</li>
              <li><strong>Bloqueio:</strong> O vencimento ocorre todo <strong>dia 05</strong>. Caso o pagamento não seja identificado em até 3 dias após o vencimento, seu acesso será bloqueado até a regularização.</li>
              <li><strong>Reembolso:</strong> Não trabalhamos com política de reembolso sob nenhuma circunstância.</li>
            </ul>
          </div>

          {/* 3.1. Cancelamento de Assinatura */}
          <div className="space-y-4">
            <h3>3.1. Cancelamento de Assinatura</h3>
            <p>
              Você pode cancelar sua assinatura a qualquer momento através das configurações da sua conta. O cancelamento interrompe a renovação futura, mas não é retroativo e não gera reembolso de valores já pagos.
              Ao cancelar, você continuará tendo acesso às funcionalidades do serviço até o final do período de faturamento vigente, após o qual o acesso será bloqueado.
            </p>
          </div>

          {/* 3.2. Renovação Automática */}
          <div className="space-y-4">
            <h3>3.2. Renovação Automática</h3>
            <p>
              Para garantir a continuidade dos seus serviços de gestão, a assinatura do {appName} possui renovação automática mensal. A cobrança é realizada de forma recorrente via Mercado Pago, com vencimento fixado no dia 05 de cada mês.
              É de sua responsabilidade garantir que haja saldo ou limite disponível na forma de pagamento selecionada para evitar a suspensão do serviço.
            </p>
          </div>

          {/* 3.3 Segurança no Pagamento e Dados Sensíveis */}
          <div className="space-y-4">
            <h3>3.3 Segurança no Pagamento e Dados Sensíveis</h3>
            <p>
              A {appName} prioriza a segurança dos seus dados financeiros. Por questões de segurança, não armazenamos em nossos servidores informações sensíveis como números de cartão de crédito ou débito.
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Intermediação Exclusiva:</strong> Toda a infraestrutura de pagamentos é fornecida pelo Mercado Pago, que é o único responsável pela captura e processamento dos dados financeiros.</li>
              <li><strong>Isenção de Responsabilidade:</strong> A {appName} não se responsabiliza por falhas, cobranças indevidas, fraudes ou quaisquer problemas decorrentes da relação entre você e o provedor de pagamentos. Qualquer disputa financeira deve ser resolvida diretamente com o Mercado Pago ou sua operadora de cartão.</li>
            </ul>
          </div>

          {/* 3.4. Alterações nos Preços */}
          <div className="space-y-4">
            <h3>3.4 Alterações nos Preços</h3>
            <p>
              Reservamo-nos o direito de ajustar os valores dos nossos planos de assinatura para refletir mudanças em nosso serviço, atualizações de mercado ou novos custos operacionais.
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Comunicação Prévia:</strong> Caso haja qualquer alteração no valor do plano que Você assina, notificaremos você com antecedência mínima de 30 (trinta) dias através do e-mail cadastrado em sua conta ou por aviso direto na interface do sistema.</li>
              <li><strong>Aceitação:</strong> A continuidade do uso do serviço após a data de vigência do novo valor será considerada como sua aceitação aos novos preços.</li>
              <li><strong>Direito de Cancelamento:</strong> Caso você não concorde com o novo valor, poderá cancelar sua assinatura a qualquer momento antes da próxima renovação, conforme as regras de cancelamento descritas no item 3.1.</li>
            </ul>
          </div>

          {/* 4. Planos */}
          <div className="space-y-4">
            <h2>4. Limitações de Uso e Planos</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Plano Inicial (MVP):</strong> Cadastro ilimitado de clientes, porém limitado a <strong>6 (seis) tipos de serviços</strong>.</li>
              <li><strong>Uso Individual:</strong> O acesso é individual. O compartilhamento de sua conta com outros profissionais é proibido e pode gerar suspensão.</li>
              <li><strong>Evolução:</strong> Funções multiusuário (equipes) são restritas a planos superiores futuros.</li>
            </ul>
          </div>

          {/* 5. Clientes */}
          <div className="space-y-4">
            <h2>5. Uso por Seus Clientes (Terceiros)</h2>
            <p>
              Quando disponível, a função de agendamento por seus clientes serve apenas como facilitador. Cancelamentos pela cliente poderão ser feitos via sistema com até 6 horas de antecedência.
              O cumprimento do horário é um acordo privado entre você e seu cliente. A {appName} não é responsável por faltas, cancelamentos de última hora ou inadimplência de terceiros.
            </p>
          </div>

          {/* 6. Dados */}
          <div className="space-y-4">
            <h2>6. Retenção e Exclusão de Dados</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Suspensão:</strong> Em caso de inadimplência, você não poderá consultar ou exportar sua lista de clientes ou histórico até quitar a pendência.</li>
              <li><strong>Prazo:</strong> Dados de contas inativas são mantidos de 6 meses a 1 ano. Após este prazo, o sistema poderá realizar a exclusão definitiva.</li>
            </ul>
          </div>

          {/* 7. Alterações */}
          <div className="space-y-4">
            <h2>7. Alterações no Serviço</h2>
            <p>
              O sistema evolui constantemente. Podemos alterar funcionalidades e interfaces sem aviso prévio para melhoria do serviço. Mudanças em planos contratados
              serão comunicadas com antecedência.
            </p>
          </div>

          {/* 8. Foro */}
          <div className="space-y-4">
            <h2>8. Foro</h2>
            <p>
              Para resolver qualquer questão técnica ou jurídica, fica eleito o Foro da Comarca de São Paulo/SP.
            </p>
          </div>

          <p>
            <strong>Última atualização:</strong> {lastUpdate}
          </p>
        </section>
      </div>
    </>
  );
}