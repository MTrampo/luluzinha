import Header from "@/components/header";

export default function PrivacyPolicy() {
  const lastUpdate = "23 de Julho de 2026";
  const appName = "Luluzinha";

  return (
    <div className="min-h-screen bg-purple-50/10 text-slate-700">
      <Header />
      <div className="mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl">
        <section className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-purple-950 font-lexend">Política de Privacidade</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Esta Política de Privacidade descreve como a {appName} coleta, utiliza e protege as suas informações e os dados inseridos no sistema. Ao utilizar nosso serviço, você concorda com as práticas descritas aqui.
            </p>
          </div>

          {/* 1. Dados Coletados */}
          <div className="space-y-4">
            <h2>1. Dados Coletados</h2>
            <p>
              Para que o serviço funcione corretamente, coletamos e armazenamos dois tipos de informações:
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Seus Dados (Prestador):</strong> No momento do cadastro, coletamos seu nome, e-mail, telefone e senha. Esses dados são essenciais para criar sua conta, processar sua assinatura e garantir sua segurança.</li>
              <li><strong>Dados de Seus Clientes (Terceiros):</strong> A {appName} permite que você cadastre o Nome e Telefone de seus clientes. Esses dados são inseridos exclusivamente por você e para o seu controle profissional.</li>
            </ul>
          </div>

          {/* 2. Finalidade de Uso dos Dados */}
          <div className="space-y-4">
            <h2>2. Finalidade de Uso dos Dados</h2>
            <p>
              Utilizamos as informações coletadas apenas para fins específicos:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-3">
              <li><strong>Operação do Sistema:</strong> Para que você possa gerenciar sua agenda e clientes de forma profissional.</li>
              <li><strong>Comunicações Obrigatórias:</strong> Para enviar alertas de segurança, confirmação de e-mail e recuperação de senha.</li>
              <li><strong>Evolução do Serviço:</strong> Para informar você sobre atualizações no sistema, novas funcionalidades ou mudanças em planos de assinatura.</li>
            </ul>
          </div>

          {/* 3. Privacidade e Compartilhamento */}
          <div className="space-y-4">
            <h2>3. Privacidade e Compartilhamento</h2>
            <p>
              A {appName} preza pela sua privacidade e não comercializa seus dados. Para o funcionamento do serviço, utilizamos parceiros estratégicos:
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Pagamentos e Dados Financeiros:</strong> A coleta, o processamento e o armazenamento de qualquer dado de pagamento (como números de cartão de crédito, CPF do titular ou dados de faturamento) são realizados exclusivamente e diretamente pelo Mercado Pago.
              </li>
              <ul className="list-disc pl-5 space-y-3">
                <li>A {appName} não tem acesso, não visualiza e não armazena seus dados financeiros sensíveis.</li>
                <li>Ao realizar o pagamento da assinatura, Você está utilizando a interface e os sistemas de segurança do Mercado Pago, que é o único responsável pela proteção desses dados específicos.</li>
              </ul>
              <li><strong>Infraestrutura de Nuvem:</strong> Os dados de cadastro (nome, e-mail e dados das suas clientes) são armazenados em nuvem com criptografia de ponta, garantindo que apenas o sistema e você tenham acesso às informações de gestão.</li>
            </ul>
          </div>

          {/* 4. Responsabilidade LGPD */}
          <div className="space-y-4">
            <h2>4. Responsabilidade LGPD</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Você é o Controlador:</strong> Como Prestador de Serviço, você é responsável por garantir que tem a autorização de seus clientes para cadastrar o nome e telefone deles na plataforma.</li>
              <li><strong>A {appName} é o Operador:</strong> Nós apenas fornecemos a tecnologia e o armazenamento seguro. Não acessamos ou utilizamos os dados de seus clientes para qualquer fim que não seja o seu próprio uso dentro do sistema.</li>
              <li><strong>Autonomia:</strong> você possui total autonomia para editar ou excluir os dados de seus clientes a qualquer momento através da interface do sistema.</li>
            </ul>
          </div>

          {/* 5. Segurança e Retenção */}
          <div className="space-y-4">
            <h2>5. Segurança e Retenção</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Proteção:</strong> Utilizamos criptografia e protocolos de segurança para proteger todas as informações contra acessos não autorizados.</li>
              <li><strong>Prazo de Retenção:</strong> Seus dados permanecem ativos enquanto sua assinatura estiver em vigor. Em caso de cancelamento ou inadimplência, as informações serão mantidas por um período de 6 (seis) meses a 1 (um) ano para possibilitar a reativação da conta, sendo excluídas permanentemente após esse prazo.</li>
            </ul>
          </div>

          {/* 6. Uso de Cookies */}
          <div id="cookies" className="space-y-4 scroll-mt-20">
            <h2>6. Uso de Cookies</h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu navegador que servem para fazer o sistema funcionar de maneira mais leve, segura e personalizada. Se você quiser entender detalhadamente o que são cookies do ponto de vista técnico, você pode acessar este <a href="https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Cookies" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">guia explicativo sobre cookies</a>.
            </p>
            <p>
              Na {appName}, utilizamos cookies essenciais e tecnologias semelhantes para as seguintes finalidades:
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Autenticação e Sessão:</strong> Para manter você conectada à sua conta de forma segura enquanto navega pela plataforma.</li>
              <li><strong>Preferências do Espaço:</strong> Para salvar suas configurações visuais, como o estado do menu lateral (aberto ou fechado) e o estabelecimento ativo.</li>
              <li><strong>Segurança e Prevenção a Fraude (Mercado Pago):</strong> Cookies de terceiros integrados ao processamento de pagamentos para garantir transações financeiras seguras.</li>
            </ul>
            <p>
              Você tem total liberdade para desativar ou gerenciar os cookies diretamente nas configurações do seu navegador. Contudo, desativar os cookies essenciais pode impedir o funcionamento correto de recursos indispensáveis para o uso da plataforma (como o login).
            </p>
          </div>

          {/* 7. Alteração Nesta Política */}
          <div className="space-y-4">
            <h2>7. Alteração Nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade ocasionalmente. Caso ocorram mudanças significativas na forma como tratamos seus dados, você será notificado através do e-mail cadastrado ou por um aviso em nosso sistema.
            </p>
          </div>

          <p>
            <strong>Última atualização:</strong> {lastUpdate}
          </p>
        </section>
      </div>
    </div>
  );
}