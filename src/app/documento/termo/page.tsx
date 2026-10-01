import Header from "@/components/header";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Conheça os termos e condições de uso do ecossistema de gestão Luluzinha para profissionais da beleza.",
  alternates: {
    canonical: "/documento/termo",
  },
};

export default function TermsOfUse() {
  const lastUpdate = "25 de Setembro de 2026";
  const appName = "Luluzinha";

  return (
    <div className="min-h-screen bg-purple-50/10 text-slate-700">
      <Header />
      <div className="mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl">
        <section className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-purple-950 font-lexend">
              Termos e Condições de Uso
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              A <strong>{appName}</strong> é um ecossistema digital de gestão e organização profissional voltado a Manicures, Nail Designers, Pedicures e Podólogas. Nosso propósito é fornecer ferramentas que tornem o seu dia a dia mais leve, profissional e organizado, permitindo que você foque no cuidado e no encantamento das suas Poderosas clientes.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Ao criar uma conta ou assinar a {appName}, você adquire uma licença de uso de software como serviço (SaaS), tendo acesso a recursos como Agenda de Atendimentos, Gestão de Poderosas, Histórico de Recebíveis (Seu Caixa) e Menu de Procedimentos, conforme as especificações do plano contratado.
            </p>
          </div>

          {/* 1. Aceite */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              1. Aceite dos Termos
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Ao cadastrar-se, acessar ou utilizar a plataforma {appName}, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde com qualquer disposição aqui estabelecida, solicitamos que não prossiga com o cadastro ou utilização do sistema.
            </p>
          </div>

          {/* 2. Fase Beta e Isenção de Responsabilidade Técnica */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              2. Versão em Fase de Testes (Beta Público) e Limitações
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              O Usuário declara ciência expressa de que a plataforma encontra-se atualmente em fase de <strong>Beta Público</strong> (em constante desenvolvimento ativo, testes de estresse e aprimoramento de funcionalidades).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed">
              <li>
                <strong>Possibilidade de Instabilidades e Ajustes:</strong> Por se tratar de uma versão de testes, o sistema pode apresentar instabilidades temporárias, lentidões momentâneas, bugs inesperados, necessidades de manutenção técnica ou eventuais ajustes e perdas de dados.
              </li>
              <li>
                <strong>Isenção de Responsabilidade por Danos Indiretos:</strong> A contratação e uso da versão Beta ocorrem por conta e risco do Usuário, que se beneficia de condições financeiras especiais de lançamento exatamente por colaborar com essa fase de testes. A {appName} não se responsabiliza por lucros cessantes, perdas financeiras, faltas de clientes ou quaisquer danos decorrentes de indisponibilidades técnicas do software.
              </li>
              <li>
                <strong>Canal Direto de Feedback:</strong> As participantes da fase Beta contam com canal de suporte direto via WhatsApp para reporte ágil de bugs e sugestões de melhorias.
              </li>
            </ul>
          </div>

          {/* 3. Oferta de Lançamento (Fundadoras) e Limite de 30 Vagas */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              3. Oferta Especial de Lançamento (Plano Fundadoras) e Vagas Limitadas
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              A oferta de assinatura no valor promocional de <strong>R$ 9,90 (nove reais e noventa centavos) mensais</strong> é uma condição especial e temporária de lançamento, vinculada à colaboração na fase Beta.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed">
              <li>
                <strong>Limite de 30 Usuárias:</strong> Esta condição promocional de R$ 9,90/mês é <strong>estritamente limitada aos primeiros 30 (trinta) assinantes</strong> que aderirem ao plano Fundadoras.
              </li>
              <li>
                <strong>Reajuste Futuro Pós-Fase de Testes:</strong> Após o encerramento da fase de testes (Alpha/Beta) e o lançamento da versão estável da plataforma, o valor da mensalidade poderá ser atualizado para o preço padrão de tabela da {appName}.
              </li>
              <li>
                <strong>Comunicação Prévia de 30 Dias:</strong> Qualquer reajuste de valor será comunicado formalmente com antecedência mínima de <strong>30 (trinta) dias</strong> por e-mail e aviso em destaque no painel. O Usuário terá total liberdade para manter a assinatura ou cancelá-la sem nenhum custo ou penalidade antes da vigência do novo valor.
              </li>
            </ul>
          </div>

          {/* 4. Degustação Gratuita de 7 Dias (Art. 49 CDC) e Pagamentos */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              4. Degustação Gratuita (7 Dias CDC), Pagamento e Recorrência
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              O processamento dos pagamentos é realizado de forma automatizada e segura exclusivamente pela infraestrutura do <strong>Mercado Pago</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed">
              <li>
                <strong>Degustação Gratuita de 7 Dias (Art. 49 do CDC):</strong> Em conformidade com o Código de Defesa do Consumidor, toda <strong>1ª assinatura</strong> realizada na plataforma concede <strong>7 (sete) dias corridos de degustação 100% gratuita</strong>.
              </li>
              <li>
                <strong>Cancelamento no Período Gratuito:</strong> Se você optar por cancelar sua assinatura durante os 7 dias de degustação, o cancelamento é realizado instantaneamente e <strong>nenhum valor será debitado do seu cartão</strong>.
              </li>
              <li>
                <strong>Primeira Cobrança e Renovação Recorrente:</strong> Passados os 7 dias de degustação sem cancelamento prévio, a primeira cobrança de R$ 9,90 será efetuada no 8º dia e a assinatura passará a renovar-se automaticamente a cada 30 (trinta) dias no cartão cadastrado.
              </li>
              <li>
                <strong>Regra de Reassinatura (Sem Duplicidade de Gratuidade):</strong> O benefício da degustação gratuita de 7 dias é concedido <strong>uma única vez por titular/espaço</strong>. Em caso de cancelamento e posterior retorno/reativação, a cobrança da nova assinatura ocorrerá imediatamente no ato da contratação.
              </li>
              <li>
                <strong>Sem Fidelidade e Sem Multas:</strong> Nossos planos não exigem fidelidade, tempo mínimo de permanência ou taxas de cancelamento. Você pode cancelar a qualquer momento nas configurações do seu painel.
              </li>
            </ul>
          </div>

          {/* 5. Cancelamento e Suspensão */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              5. Cancelamento e Vigência de Acesso
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Ao cancelar uma assinatura ativa após o período de degustação de 7 dias, a cobrança para os meses subsequentes é interrompida. Você continuará com acesso integral a todas as funcionalidades do seu espaço até o término do ciclo mensal que já foi pago, data após a qual o acesso aos recursos restritos será suspenso.
            </p>
          </div>

          {/* 6. Segurança e Dados Financeiros */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              6. Segurança nos Pagamentos e Dados Sensíveis
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              A {appName} não coleta, não processa e não armazena em seus servidores dados sensíveis de cartão de crédito ou débito. Toda a captura, tokenização e liquidação financeira são realizadas diretamente em ambiente certificado PCI-DSS pelo Mercado Pago.
            </p>
          </div>

          {/* 7. Uso com Clientes e Relações Comerciais */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              7. Relação Comercial com suas Clientes (Poderosas)
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              A {appName} é estritamente uma ferramenta de gestão e apoio à rotina do seu espaço. Não intermediamos pagamentos entre você e suas clientes, não cobramos taxas sobre os seus atendimentos e não possuímos qualquer responsabilidade sobre a realização dos procedimentos, comparecimento de clientes ou acordos privados de preço e horário firmados no seu negócio.
            </p>
          </div>

          {/* 8. Foro */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              8. Legislação Aplicável e Foro
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial pelo Código de Defesa do Consumidor (Lei nº 8.078/1990), pelo Marco Civil da Internet (Lei nº 12.965/2014) e pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Para dirimir eventuais controvérsias decorrentes destes Termos, fica eleito o Foro da Comarca de São Paulo/SP, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </div>

          <p className="text-xs text-slate-500 pt-4 border-t border-purple-100">
            <strong>Última atualização:</strong> {lastUpdate}
          </p>
        </section>
      </div>
    </div>
  );
}