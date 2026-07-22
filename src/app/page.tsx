import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { getUserLoggedApi } from "@/back/account/service/auth.api";
import HomeAnimations from "@/components/animations/home-animations";
import HeroAndFeaturesSection from "@/features/landing/hero-and-features";

export default async function Home() {
  const response = await getUserLoggedApi();
  const user = response?.data?.user;

  return (
    <div className="min-h-screen bg-purple-50/20 flex flex-col antialiased overflow-x-hidden">
      {/* Header com estilo roxo translúcido */}
      <Header />

      <main className="grow">
        {/* Hero e Funcionalidades Unificados */}
        <HeroAndFeaturesSection user={user} />

        {/* Seção Por Que Luluzinha */}
        <section className="py-20 sm:py-28 bg-purple-50/30">
          <div className="mx-auto max-w-5xl md:max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight font-lexend">
                  Feito com muito carinho para a sua rotina
                </h2>
                <p className="text-purple-900/85 text-lg leading-relaxed">
                  Sabemos que o dia a dia na bancada é corrido. Luluzinha foi criada para simplificar seu trabalho, permitindo que você gerencie seu negócio em poucos segundos entre um atendimento e outro.
                </p>
                <div className="pt-2">
                  <Button className="group bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold px-6 py-5 shadow-md shadow-purple-100 transition-all duration-200" asChild>
                    <Link href={user ? "/painel" : "/cadastrar"} className="inline-flex items-center">
                      {user ? "Acessar minha bancada" : "Quero transformar minha bancada"}
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
                      Você pode abrir sua bancada digital no celular, tablet ou computador. Crie um atalho rápido na sua tela inicial e use o sistema como se fosse um aplicativo instalado!
                    </p>
                  </div>
                </div>

                {/* Razão 3 */}
                <div className="flex gap-4 p-5 rounded-2xl bg-white border border-purple-100/60 shadow-sm transition-all hover:translate-x-1 duration-200 animate-reason-item opacity-0">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold font-lexend">3</div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-purple-950 font-lexend">Um histórico amigo para crescer</h3>
                    <p className="text-purple-900/70 text-sm leading-relaxed">
                      Tenha clareza do quanto a sua bancada faturou nos últimos 30 dias e valorize a sua dedicação. O controle financeiro ideal para planejar suas próximas metas e conquistas.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Seção de Preço */}
        <section id="preco" className="py-20 sm:py-28 bg-white border-y border-purple-100/40 scroll-mt-20">
          <div className="mx-auto max-w-5xl md:max-w-4xl px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight font-lexend">
                Valor justo para apoiar o seu negócio
              </h2>
              <p className="text-purple-900/70 text-lg max-w-2xl mx-auto">
                Acreditamos no seu sucesso e queremos ser parceiros da sua bancada. Por isso, oferecemos um preço extremamente acessível.
              </p>
            </div>

            <div className="relative max-w-md mx-auto bg-purple-50/50 rounded-3xl border border-purple-200 p-8 sm:p-10 shadow-lg hover:shadow-xl shadow-purple-100/30 overflow-hidden transition-all duration-300 animate-pricing-card opacity-0">
              {/* Selo de Destaque */}
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider font-lexend">
                Acesso Total
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-purple-950 font-lexend">Plano Luluzinha</h3>
                  <p className="text-purple-900/70 text-sm">Tudo o que você precisa para dominar sua agenda e ver seu negócio decolar.</p>
                </div>

                <div className="flex items-baseline text-purple-950">
                  <span className="text-2xl font-extrabold tracking-tight">R$</span>
                  <span className="text-5xl font-black tracking-tight font-lexend text-purple-600">9,90</span>
                  <span className="ml-1 text-xl font-semibold text-purple-900/60">/mês</span>
                </div>

                <div className="border-t border-purple-200/50 pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 shrink-0" />
                    <span className="text-purple-900/80 text-sm font-medium">Agenda de Atendimentos ilimitada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 shrink-0" />
                    <span className="text-purple-900/80 text-sm font-medium">Cadastro completo de Poderosas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 shrink-0" />
                    <span className="text-purple-900/80 text-sm font-medium">Seu Caixa (Histórico da Bancada)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 shrink-0" />
                    <span className="text-purple-900/80 text-sm font-medium">Menu de Procedimentos personalizado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 shrink-0" />
                    <span className="text-purple-900/80 text-sm font-medium">Acesso facilitado no celular ou PC</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="group w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold py-6 text-base shadow-md shadow-purple-100 transition-all duration-200" asChild>
                    <Link href={user ? "/painel" : "/cadastrar"} className="inline-flex items-center justify-center">
                      {user ? "Ir para a minha bancada" : "Criar minha conta e testar"}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 delay-75 group-hover:translate-x-1.5" />
                    </Link>
                  </Button>
                </div>

                <div className="text-center pt-2 space-y-2">
                  <p className="text-xs text-purple-900/60">
                    Processado com segurança via <strong className="text-purple-900/80">Mercado Pago</strong>
                  </p>
                  <p className="text-[11px] text-purple-900/40 leading-normal">
                    Cobrança mensal recorrente. Cancele quando quiser, sem burocracia ou taxas de cancelamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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

              <AccordionItem value="faq-1" className="border border-purple-100 bg-white rounded-xl px-5 py-2 shadow-sm">
                <AccordionTrigger className="text-base font-bold text-purple-950 hover:text-purple-600 hover:no-underline font-lexend text-left">
                  Como funciona o teste gratuito da Luluzinha?
                </AccordionTrigger>
                <AccordionContent className="text-purple-900/70 leading-relaxed pt-2 text-sm">
                  Ao se cadastrar na plataforma, você pode experimentar todas as funcionalidades da sua bancada digital gratuitamente. Sem compromissos, para você ver na prática como sua rotina vai ficar muito mais organizada.
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

        {/* Seção CTA Final */}
        <section className="py-20 sm:py-28 bg-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-95 -z-10"></div>

          <div className="mx-auto max-w-4xl px-6 text-center space-y-8 relative z-10">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-sm">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight font-lexend leading-tight">
              Vamos crescer juntas e organizar a sua bancada?
            </h2>

            <p className="text-lg text-purple-100 font-medium max-w-2xl mx-auto leading-relaxed">
              Junte-se a várias manicures que já aposentaram o caderninho de papel e hoje têm um dia a dia muito mais profissional e leve.
            </p>

            <div className="pt-4">
              <Button size="lg" className="group bg-white text-purple-700 hover:bg-purple-50 font-extrabold text-base px-8 py-6 rounded-full shadow-lg transition-all duration-200 transform hover:-translate-y-0.5" asChild>
                <Link href={user ? "/painel" : "/cadastrar"}>
                  {user ? "Entrar na minha bancada digital" : "Criar minha bancada digital"}
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
