import Header from "@/components/header";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como a Luluzinha coleta, utiliza e protege os dados do seu espaço e das suas poderosas clientes.",
  alternates: {
    canonical: "/documento/politica",
  },
};

export default function PrivacyPolicy() {
  const lastUpdate = "25 de Setembro de 2026";
  const appName = "Luluzinha";

  return (
    <div className="min-h-screen bg-purple-50/10 text-slate-700">
      <Header />
      <div className="mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl">
        <section className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-purple-950 font-lexend">
              Política de Privacidade
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Esta Política de Privacidade descreve de forma transparente como a <strong>{appName}</strong> coleta, utiliza, armazena e protege as suas informações e os dados das suas clientes geridos no sistema, em estrita observância à Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).
            </p>
          </div>

          {/* 1. Dados Coletados */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              1. Dados Coletados
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Para fornecer as funcionalidades do seu espaço digital, coletamos apenas os dados estritamente necessários:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed">
              <li>
                <strong>Seus Dados Cadastrais (Prestadora):</strong> E-mail, senha criptografada, nome profissional e telefone de contato. Esses dados são fundamentais para autenticação segura, criação do seu espaço e comunicação do sistema.
              </li>
              <li>
                <strong>Dados das suas Clientes (Poderosas):</strong> Nome, telefone e histórico de atendimentos e procedimentos. Essas informações são inseridas voluntariamente por você para o controle exclusivo do seu atendimento.
              </li>
            </ul>
          </div>

          {/* 2. Finalidade de Uso */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              2. Finalidade do Tratamento de Dados
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed">
              <li><strong>Operação da Plataforma:</strong> Permitir o gerenciamento da sua Agenda de Atendimentos, base de Poderosas e Histórico de Recebíveis.</li>
              <li><strong>Comunicações e Segurança:</strong> Envio de código OTP de verificação, notificações de segurança e avisos operacionais relevantes.</li>
              <li><strong>Aprimoramento Contínuo (Fase Beta):</strong> Melhorar a performance e a usabilidade do sistema com base em feedbacks.</li>
            </ul>
          </div>

          {/* 3. Privacidade e Pagamentos via Mercado Pago */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              3. Dados Financeiros e Mercado Pago
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              A {appName} <strong>não armazena nem tem acesso aos dados sensíveis do seu cartão de crédito ou débito</strong>. Toda a infraestrutura de pagamentos, cobrança recorrente e tokenização é gerida exclusivamente pelo <strong>Mercado Pago</strong> em ambiente certificado com o padrão internacional de segurança PCI-DSS.
            </p>
          </div>

          {/* 4. Papéis sob a LGPD */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              4. Responsabilidades sob a LGPD (Controlador e Operador)
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed">
              <li>
                <strong>Você como Controladora:</strong> Como dona do seu negócio, você é a Controladora dos dados pessoais das suas clientes que cadastra na plataforma, sendo responsável por inseri-los com a devida legitimidade.
              </li>
              <li>
                <strong>A Luluzinha como Operadora:</strong> Atuamos exclusivamente como fornecedora de tecnologia e custódia segura em nuvem. Não comercializamos, não compartilhamos e não utilizamos os dados das suas clientes para qualquer fim alheio à sua operação.
              </li>
            </ul>
          </div>

          {/* 5. Direitos do Titular (Art. 18 LGPD) */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              5. Seus Direitos como Titular de Dados
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Conforme o Art. 18 da LGPD, você tem o direito de, a qualquer momento:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base leading-relaxed">
              <li>Confirmar a existência de tratamento e acessar os seus dados;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados diretamente no seu painel;</li>
              <li>Solicitar a exclusão definitiva da sua conta e dos dados vinculados ao seu espaço;</li>
              <li>Exportar suas informações de cadastro e histórico.</li>
            </ul>
            <p className="text-sm sm:text-base leading-relaxed">
              Para exercer qualquer um desses direitos, basta entrar em contato através do nosso canal de suporte e privacidade diretamente pelo WhatsApp ou pelo e-mail disponibilizado no sistema.
            </p>
          </div>

          {/* 6. Uso de Cookies */}
          <div id="cookies" className="space-y-3 scroll-mt-20">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              6. Uso de Cookies
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Utilizamos apenas cookies essenciais e tecnologias seguras para autenticação de sessão, preferências visuais do seu espaço e validação de segurança nas transações com o provedor de pagamentos. Você pode desativar cookies no navegador, mas isso poderá impedir a utilização de recursos essenciais como o login no painel.
            </p>
          </div>

          {/* 7. Alterações */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-950 font-lexend">
              7. Alterações Nesta Política
            </h2>
            <p className="text-sm sm:text-base leading-relaxed">
              Esta Política de Privacidade poderá ser atualizada para refletir novas funcionalidades ou adequações legais. Mudanças substanciais serão comunicadas de forma visível em nossos canais oficiais e dentro do sistema.
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