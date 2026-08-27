import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Sparkle, Calendar, Users, TrendingUp, Sparkles } from "lucide-react";
import mockupS26 from "@/commons/assets/imgs/mockup-s26.png";
import mockupDell from "@/commons/assets/imgs/mockup-dell.png";
import mockupMovingHand from "@/commons/assets/imgs/mockup-moving-hand.png";
import mockupS26Hand from "@/commons/assets/imgs/mockup-s26-hand.png";
import { UserProfile } from "@/commons/models/user";

interface HeroAndFeaturesSectionProps {
  user: UserProfile;
}

export default function HeroAndFeaturesSection({ user }: HeroAndFeaturesSectionProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 md:py-32 z-20">
        {/* Efeitos de luz no fundo para deixar o roxo aconchegante */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl -z-10"></div>

        <div className="mx-auto max-w-5xl md:max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Conteúdo de Texto */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-12 animate-hero-text-content opacity-0">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-purple-950 tracking-tight leading-[1.1] font-lexend animate-hero-title opacity-0">
                  Seu espaço digital completo para você <span className="text-purple-600 font-extrabold">brilhar ainda mais</span>
                </h1>

                {/* Mockup Laptop & Celular para Mobile/Tablet (Abaixo do título) */}
                <div className="lg:hidden flex justify-center items-end relative w-full min-h-45 sm:min-h-70 mt-16 mb-2 select-none">
                  {/* Efeito blur de fundo reduzido para mobile */}
                  <div className="absolute inset-0 bg-purple-200/50 rounded-full blur-2xl opacity-60 -z-10 animate-hero-light"></div>

                  {/* Celular de fundo (alinhado ao chão) */}
                  <div className="absolute bottom-0 right-[12%] sm:right-[22%] w-full max-w-22.5 sm:max-w-32.5 z-20">
                    <div className="relative w-full mobile-animate-hero-phone opacity-0">
                      <Image
                        src={mockupS26}
                        alt="Smartphone"
                        priority
                        className="w-full h-auto drop-shadow-xl"
                      />
                    </div>
                  </div>

                  {/* Laptop na frente (alinhado ao chão) */}
                  <div className="relative w-full max-w-50 sm:max-w-75 mobile-animate-hero-dell opacity-0 z-10">
                    <Image
                      src={mockupDell}
                      alt="Laptop"
                      priority
                      className="w-full h-auto drop-shadow-xl"
                    />
                  </div>
                </div>
              </div>

              <p className="text-lg md:text-xl text-purple-900/80 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-hero-desc opacity-0">
                Preparamos cada detalhe com muito carinho para que seu dia a dia como manicure seja mais leve, organizado e profissional. Gerencie sua agenda de atendimentos, encante suas Poderosas e acompanhe o sucesso do seu espaço.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-hero-buttons opacity-0">
                {user ? (
                  <Button size="lg" className="group bg-purple-600 hover:bg-purple-700 text-white font-bold text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-100 transition-all duration-200 transform" asChild>
                    <Link href="/painel">
                      Acessar meu espaço
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 delay-75 group-hover:translate-x-1.5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="group bg-purple-600 hover:bg-purple-700 text-white font-bold text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-100 transition-all duration-200 transform" asChild>
                      <Link href="/cadastrar">
                        Começar gratuitamente
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 delay-75 group-hover:translate-x-1.5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50/50 hover:text-purple-900 font-semibold text-base px-8 py-6 rounded-full transition-all duration-200" asChild>
                      <Link href="/entrar">
                        Entrar no meu espaço
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-4 text-sm text-purple-900/60 font-medium">
                <div className="flex items-center gap-1.5 animate-hero-check opacity-0">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-700 tracking-wider uppercase font-lexend">
                    Beta
                  </span>
                  <span>Espaço de Testes</span>
                </div>
                <div className="flex items-center gap-1.5 animate-hero-check opacity-0">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>Sem fidelidade</span>
                </div>
                <div className="flex items-center gap-1.5 animate-hero-check opacity-0">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span>Seguro com Mercado Pago</span>
                </div>
              </div>
            </div>

            {/* Imagem do Laptop (Dell) e Celular / Mockup - Apenas para Desktop */}
            <div className="hidden lg:flex lg:col-span-5 justify-center items-end relative desktop-hero-phone-container min-h-120">
              {/* Efeito de luz de fundo para destacar o mockup */}
              <div className="absolute -inset-4 bg-purple-200 rounded-full blur-3xl opacity-75 -z-10 animate-hero-light"></div>

              {/* Wrapper estático para marcar o ponto de partida do celular (S26) - Fica atrás do notebook, alinhado ao final */}
              <div className="absolute bottom-0 right-2 sm:right-10 lg:right-7 w-full max-w-72 desktop-hero-phone-wrapper z-10">
                <div className="relative w-full desktop-animate-hero-phone opacity-0">
                  <Image
                    src={mockupS26}
                    alt="Mockup do aplicativo Luluzinha em um smartphone"
                    priority
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Mockup Laptop Dell (Fica na frente do celular, maior e alinhado ao final) */}
              <div className="relative w-full max-w-4xl desktop-animate-hero-dell opacity-0 z-20 mt-auto">
                <Image
                  src={mockupDell}
                  alt="Painel do aplicativo Luluzinha no laptop"
                  priority
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section id="funcionalidades" className="py-20 sm:py-28 bg-white border-y border-purple-100/40 scroll-mt-20 z-10">
        <div className="mx-auto max-w-5xl md:max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Coluna Esquerda - Imagens e Mockups (lg:col-span-5) */}
            <div className="lg:col-span-5 order-last lg:order-first mt-16 lg:mt-0 flex justify-center items-end relative features-phone-container min-h-70 sm:min-h-90 lg:min-h-120 p-6 pb-0">
              {/* Moldura de fundo decorativa com gradiente suave inspirado na paleta de cores da marca e topo branco para efeito de saída */}
              <div className="absolute inset-0 bg-linear-to-b from-white via-[#F5EBFF] to-[#E3D0FF] rounded-3xl border-x border-b border-purple-100/30 z-0"></div>

              {/* Efeito de luz de fundo para destacar o mockup */}
              <div className="absolute -inset-4 bg-purple-200 rounded-full blur-3xl opacity-50 -z-10 animate-hand-light" />

              {/* Mockup Mão esperando */}
              <div
                className="relative w-full max-w-60 sm:max-w-[320px] lg:max-w-none animate-moving-hand opacity-0 z-10 select-none"
                style={{
                  maskImage: 'linear-gradient(to top, transparent 5%, black 25%)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 5%, black 25%)'
                }}
              >
                <Image
                  src={mockupMovingHand}
                  alt="Mão esperando celular"
                  priority
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>

              {/* Mockup Final com Celular */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-60 sm:max-w-[320px] lg:max-w-none animate-final-hand opacity-0 pointer-events-none z-10 select-none">
                <Image
                  src={mockupS26Hand}
                  alt="Mão segurando o painel do aplicativo Luluzinha"
                  priority
                  className="w-full h-auto md:drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Coluna Direita - Cards e Textos (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-10">
              {/* Textos de Cabeçalho das Funcionalidades */}
              <div className="text-center lg:text-left space-y-4 max-w-3xl lg:max-w-none">
                <h2 className="text-3xl sm:text-4xl font-black text-purple-950 tracking-tight font-lexend animate-features-title opacity-0">
                  Tudo o que seu espaço precisa para crescer
                </h2>
                <p className="text-lg text-purple-900/70 animate-features-desc opacity-0">
                  Criamos um espaço completo e fácil de usar, eliminando a papelada para você focar no que faz de melhor: deixar as unhas maravilhosas.
                </p>
              </div>

              {/* Grid de 2x2 dos Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Card 1 - Agenda de Atendimentos */}
                <Card className="animate-feature-card opacity-0 border-purple-100/70 hover:border-purple-200 hover:shadow-md hover:shadow-purple-50/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-purple-950 font-lexend">
                      Agenda de Atendimentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <CardDescription className="text-purple-900/70 text-sm leading-relaxed">
                      Marque e organize seus horários com total clareza. Tenha uma visão geral do seu dia e da sua semana na palma da mão.
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Card 2 - Gestão de Poderosas */}
                <Card className="animate-feature-card opacity-0 border-purple-100/70 hover:border-purple-200 hover:shadow-md hover:shadow-purple-50/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-purple-950 font-lexend">
                      Gestão de Poderosas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <CardDescription className="text-purple-900/70 text-sm leading-relaxed">
                      Cadastre suas clientes, acompanhe o histórico de procedimentos de cada uma e mantenha o contato sempre atualizado de forma simples.
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Card 3 - Seu Caixa */}
                <Card className="animate-feature-card opacity-0 border-purple-100/70 hover:border-purple-200 hover:shadow-md hover:shadow-purple-50/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-purple-950 font-lexend">
                      Seu Caixa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <CardDescription className="text-purple-900/70 text-sm leading-relaxed">
                      Acompanhe o faturamento e o rendimento do seu espaço com o Histórico de Recebíveis de 30 dias. Chega de somas confusas no papel.
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Card 4 - Menu de Procedimentos */}
                <Card className="animate-feature-card opacity-0 border-purple-100/70 hover:border-purple-200 hover:shadow-md hover:shadow-purple-50/50 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold text-purple-950 font-lexend">
                      Menu de Procedimentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <CardDescription className="text-purple-900/70 text-sm leading-relaxed">
                      Organize e configure seus principais serviços, preços e tempo médio de duração para facilitar seus agendamentos rápidos.
                    </CardDescription>
                  </CardContent>
                </Card>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
