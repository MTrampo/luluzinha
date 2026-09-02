import {
  FaWandMagicSparkles,
  FaCalendarDays,
  FaChartLine,
  FaArrowRight
} from "react-icons/fa6";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: FaWandMagicSparkles,
      title: "Configure seu Espaço",
      description:
        "Nosso onboarding acolhedor guia você em 1 minuto para adicionar seu nome, foto e montar seu menu de procedimentos com os seus preços.",
    },
    {
      number: "02",
      icon: FaCalendarDays,
      title: "Divulgue e Agende",
      description:
        "Compartilhe seus dias disponíveis nas redes sociais com a arte automática e marque os atendimentos das suas Poderosas sem rasuras.",
    },
    {
      number: "03",
      icon: FaChartLine,
      title: "Acompanhe Seu Caixa",
      description:
        "Veja o faturamento do seu espaço crescer em tempo real. Tenha clareza de cada centavo que entrou no dia e no mês, sem contas na mão.",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 sm:py-28 bg-purple-50/20 relative overflow-hidden scroll-mt-20">
      <div className="mx-auto max-w-5xl md:max-w-7xl px-6">

        {/* Cabeçalho da Seção */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-950 tracking-tight font-lexend animate-how-title opacity-0">
            Como funciona em 3 passos simples, rápido e acolhedor
          </h2>

          <p className="text-base sm:text-lg text-purple-900/70 font-medium animate-how-desc opacity-0">
            Você não precisa entender nada de tecnologia. O sistema foi feito para ser intuitivo e leve desde o primeiro clique.
          </p>
        </div>

        {/* Grid de 3 Passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative items-stretch">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white border border-purple-100 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 flex flex-col justify-between animate-how-card opacity-0"
              >

                <div className="space-y-6">
                  {/* Topo do Card com Número e Ícone */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl font-black text-purple-200 font-lexend">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Título e Descrição */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-purple-950 font-lexend">
                      {step.title}
                    </h3>
                    <p className="text-sm text-purple-900/70 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Linha de Conexão Sutil entre passos */}
                <div className="pt-6 border-t border-purple-50 mt-6 flex items-center text-xs font-bold text-purple-700">
                  <span>Passo {idx + 1} de 3</span>
                  {idx < steps.length - 1 && (
                    <FaArrowRight className="w-3 h-3 ml-auto text-purple-300 hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
