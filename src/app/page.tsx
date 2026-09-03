import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { getUserLoggedApi } from "@/back/account/service/auth.api";
import { getActivePlansAction } from "@/actions/subscription";
import HomeAnimations from "@/components/animations/home-animations";
import HeroAndFeaturesSection from "@/features/landing/hero-and-features";
import { StoryShareShowcase } from "@/features/landing/story-share-showcase";
import { HowItWorksSection } from "@/features/landing/how-it-works";
import { LandingPricingCard } from "@/features/landing/pricing-card";

export default async function Home() {
  const [userResponse, plansResponse] = await Promise.all([
    getUserLoggedApi(),
    getActivePlansAction()
  ]);

  const user = userResponse?.data?.user;
  // Planos públicos da vitrine (exclui convites privados de valor 0), ordenados por prioridade (sort_order ASC) e limitados a 3
  const publicPlans = (plansResponse?.data || [])
    .filter((p) => p.price > 0)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3);


  return (
    <div className="min-h-screen bg-purple-50/20 flex flex-col antialiased overflow-x-hidden">
      {/* Header com estilo roxo translúcido */}
      <Header />

      <main className="grow">
        {/* Hero e Funcionalidades Unificados */}
        <HeroAndFeaturesSection user={user} />

        {/* Destaque da Arte para Stories e Status do WhatsApp */}
        <StoryShareShowcase />

        {/* Como Funciona em 3 Passos Simples */}
        <HowItWorksSection />

        {/* Seção Por Que Luluzinha */}
        <section id="motivos" className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-5xl md:max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight font-lexend">
                  Feito com muito carinho para a sua rotina
                </h2>
                <p className="text-purple-900/85 text-lg leading-relaxed">
                  Sabemos que o dia a dia no seu espaço de atendimento é corrido. Luluzinha foi criada para simplificar seu trabalho, permitindo que você gerencie seu negócio em poucos segundos entre um atendimento e outro.
                </p>
                <div className="pt-2">
                  <Button className="group bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold px-6 py-5 shadow-md shadow-purple-100 transition-all duration-200" asChild>
                    <Link href={user ? "/painel" : "#preco"} className="inline-flex items-center">
                      {user ? "Acessar meu espaço" : "Conhecer nossos planos"}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 delay-75 group-hover:translate-x-1.5" />
                    </Link>
                  </Button>

                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">

                {/* Razão 1 */}
                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-purple-100/60 shadow-sm transition-all hover:translate-x-1 duration-200 animate-reason-item opacity-0">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold font-lexend">1</div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-purple-950 font-lexend">Chega de papelzinho sumindo</h3>
                    <p className="text-purple-900/70 text-sm leading-relaxed">
                      Sua agenda no papel pode rasgar, molhar ou sumir. Na Luluzinha, todos os agendamentos e contatos das suas Poderosas ficam salvos na nuvem com segurança máxima.
                    </p>
                  </div>
                </div>

                {/* Razão 2 */}
                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-purple-100/60 shadow-sm transition-all hover:translate-x-1 duration-200 animate-reason-item opacity-0">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold font-lexend">2</div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-purple-950 font-lexend">Acesse de qualquer lugar</h3>
                    <p className="text-purple-900/70 text-sm leading-relaxed">
                      Você pode abrir seu espaço digital no celular, tablet ou computador. Crie um atalho rápido na sua tela inicial e use o sistema como se fosse um aplicativo instalado!
                    </p>
                  </div>
                </div>

                {/* Razão 3 */}
                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-purple-100/60 shadow-sm transition-all hover:translate-x-1 duration-200 animate-reason-item opacity-0">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold font-lexend">3</div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-purple-950 font-lexend">Um histórico amigo para crescer</h3>
                    <p className="text-purple-900/70 text-sm leading-relaxed">
                      Tenha clareza do quanto o seu espaço faturou nos últimos 30 dias e valorize a sua dedicação. O controle financeiro ideal para planejar suas próximas metas e conquistas.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Seção de Preço (exibida apenas se houver planos ativos) */}
        {publicPlans.length > 0 && (
          <section id="preco" className="py-20 sm:py-28 bg-white border-y border-purple-100/40 scroll-mt-20">
            <div className="mx-auto max-w-5xl md:max-w-7xl px-6">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight font-lexend">
                  Valor justo para apoiar o seu negócio
                </h2>
                <p className="text-purple-900/70 text-lg max-w-2xl mx-auto">
                  Acreditamos no seu sucesso e queremos ser parceiros do seu espaço. Por isso, oferecemos um preço extremamente acessível.
                </p>
              </div>

              {/* Grid Responsivo Adaptativo para até 3 Planos */}
              <div
                className={`grid gap-8 mx-auto items-stretch ${publicPlans.length === 1
                    ? "max-w-md grid-cols-1"
                    : publicPlans.length === 2
                      ? "max-w-4xl grid-cols-1 md:grid-cols-2"
                      : "max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
              >
                {publicPlans.map((plan) => (
                  <LandingPricingCard key={plan.id} plan={plan} user={user} />
                ))}
              </div>
            </div>
          </section>
        )}



        {/* Seção FAQ/Dúvidas */}
        <section id="duvidas" className="py-20 sm:py-28 bg-purple-50/20 scroll-mt-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight font-lexend">
                Dúvidas Frequentes
              </h2>
              <p className="text-purple-900/70 text-lg">
                Ficou com alguma dúvida? Preparamos respostas rápidas para te ajudar.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">

              <AccordionItem value="faq-alpha" className="border border-purple-100 bg-white rounded-xl px-5 py-2 shadow-sm">
                <AccordionTrigger className="text-base font-bold text-purple-950 hover:text-purple-600 hover:no-underline font-lexend text-left">
                  O que significa o sistema estar na fase Alpha?
                </AccordionTrigger>
                <AccordionContent className="text-purple-900/70 leading-relaxed pt-2 text-sm">
                  Significa que a Luluzinha é um sistema novinho e está em desenvolvimento ativo e testes fechados (nosso espaço Alpha)! Todas as funções principais como a Agenda de Atendimentos, Cadastro de Poderosas e Histórico de Caixa funcionam 100%, mas ainda estamos polindo cada detalhe com um grupo seleto de profissionais. Por fazer parte dessa fase inicial, você conta com suporte direto e exclusivo via WhatsApp e garante condições especiais de lançamento!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-1" className="border border-purple-100 bg-white rounded-xl px-5 py-2 shadow-sm">
                <AccordionTrigger className="text-base font-bold text-purple-950 hover:text-purple-600 hover:no-underline font-lexend text-left">
                  Como funciona o teste gratuito da Luluzinha?
                </AccordionTrigger>
                <AccordionContent className="text-purple-900/70 leading-relaxed pt-2 text-sm">
                  Ao se cadastrar na plataforma, você pode experimentar todas as funcionalidades do seu espaço digital gratuitamente. Sem compromissos, para você ver na prática como sua rotina vai ficar muito mais organizada.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-2" className="border border-purple-100 bg-white rounded-xl px-5 py-2 shadow-sm">
                <AccordionTrigger className="text-base font-bold text-purple-950 hover:text-purple-600 hover:no-underline font-lexend text-left">
                  Preciso instalar o aplicativo na loja de apps (Play Store ou App Store)?
                </AccordionTrigger>
                <AccordionContent className="text-purple-900/70 leading-relaxed pt-2 text-sm">
                  Não é necessário baixar nada pelas lojas! O sistema Luluzinha é um aplicativo web progressivo. Você acessa pelo navegador do celular e, com apenas dois toques, pode criar um atalho na tela inicial que se comporta exatamente como um aplicativo comum, economizando espaço no seu celular.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-3" className="border border-purple-100 bg-white rounded-xl px-5 py-2 shadow-sm">
                <AccordionTrigger className="text-base font-bold text-purple-950 hover:text-purple-600 hover:no-underline font-lexend text-left">
                  O pagamento por Mercado Pago é seguro?
                </AccordionTrigger>
                <AccordionContent className="text-purple-900/70 leading-relaxed pt-2 text-sm">
                  Totalmente seguro! Todo o processamento de pagamento e dados de faturamento é feito de forma exclusiva e direta pelo Mercado Pago. A Luluzinha não tem acesso, não visualiza e não armazena nenhuma informação financeira sensível sua, garantindo privacidade completa.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-4" className="border border-purple-100 bg-white rounded-xl px-5 py-2 shadow-sm">
                <AccordionTrigger className="text-base font-bold text-purple-950 hover:text-purple-600 hover:no-underline font-lexend text-left">
                  Posso cancelar a assinatura quando eu quiser?
                </AccordionTrigger>
                <AccordionContent className="text-purple-900/70 leading-relaxed pt-2 text-sm">
                  Sim! Não temos contrato de fidelidade nem letras miúdas. Você pode cancelar sua assinatura mensal a qualquer momento através do painel, sem taxas extras ou burocracia de cancelamento.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="faq-5" className="border border-purple-100 bg-white rounded-xl px-5 py-2 shadow-sm">
                <AccordionTrigger className="text-base font-bold text-purple-950 hover:text-purple-600 hover:no-underline font-lexend text-left">
                  O que acontece com os meus dados se eu cancelar?
                </AccordionTrigger>
                <AccordionContent className="text-purple-900/70 leading-relaxed pt-2 text-sm">
                  Respeitamos muito seu trabalho e sua privacidade. Se você cancelar a assinatura ou ficar inadimplente, guardamos seus dados cadastrados e as informações das suas Poderosas em segurança por um período de 6 meses a 1 ano. Caso precise retornar, tudo estará do jeito que deixou. Passado esse período, os dados serão excluídos definitivamente de acordo com as normas da LGPD.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        </section>

        {/* Seção CTA Final (Full-Width contínua até o Rodapé) */}
        <section className="py-20 sm:py-28 bg-linear-to-b from-purple-900 via-purple-950 to-neutral-900 text-white relative overflow-hidden">
          {/* Efeitos de luz ambiente elegantes */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 sm:w-120 h-96 sm:h-120 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="mx-auto max-w-4xl px-6 text-center space-y-8 relative z-10">
            <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-inner">
              <Heart className="h-7 w-7 text-pink-300 fill-pink-300" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-lexend leading-tight">
              Vamos crescer juntas e organizar o seu espaço?
            </h2>

            <p className="text-base sm:text-lg text-purple-200/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Junte-se a várias manicures que já aposentaram o caderninho de papel e hoje têm um dia a dia muito mais profissional e leve.
            </p>

            <div className="pt-2">
              <Button
                size="lg"
                className="group bg-white text-purple-950 hover:bg-purple-50 font-black text-base px-8 sm:px-10 py-6 sm:py-7 rounded-full shadow-xl shadow-black/20 hover:shadow-2xl active:scale-[0.98] transition-all duration-200"
                asChild
              >
                <Link href={user ? "/painel" : "#preco"}>
                  {user ? "Entrar no meu espaço digital" : "Conhecer nossos planos"}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 delay-75 group-hover:translate-x-1.5" />
                </Link>

              </Button>
            </div>
          </div>
        </section>


      </main>

      {/* Footer */}
      <Footer />

      {/* GSAP Scroll & Entrance animations */}
      <HomeAnimations />
    </div>
  );
}
