import Image from "next/image";
import diasDisponiveisImg from "@/commons/assets/imgs/dias-disponiveis.png";
import {
  FaInstagram,
  FaWhatsapp,
  FaBolt,
  FaCalendarCheck
} from "react-icons/fa6";


export function StoryShareShowcase() {
  return (
    <section id="divulgacao" className="py-20 sm:py-28 bg-white border-y border-purple-100/40 relative overflow-hidden scroll-mt-20">
      {/* Efeitos de iluminação de fundo */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="mx-auto max-w-5xl md:max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Coluna Visual - Mockup do Story / Status */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            {/* Card com efeito de celular e sombra suave */}
            <div className="relative w-full max-w-70 sm:max-w-[320px] aspect-9/16 rounded-[40px] p-3 bg-linear-to-b from-purple-200/60 via-purple-100/40 to-purple-200/60 shadow-2xl shadow-purple-900/15 ring-1 ring-purple-300/40 animate-story-mockup opacity-0">
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-purple-50 shadow-inner">
                <Image
                  src={diasDisponiveisImg}
                  alt="Arte de Dias Disponíveis gerada pelo sistema Luluzinha"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Selo Flutuante Inferior Esquerdo */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md border border-purple-100 px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold">
                  <FaWhatsapp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pronto para o</p>
                  <p className="text-xs font-black text-purple-950">Status & Stories</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna de Conteúdo Explicativo */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-950 tracking-tight font-lexend leading-tight animate-story-title opacity-0">
                Divulgue seus dias livres com 1 clique no WhatsApp e Instagram
              </h2>

              <p className="text-base sm:text-lg text-purple-900/70 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-story-desc opacity-0">
                Tem datas vagas na sua semana? A Luluzinha cria na hora uma arte profissional e personalizada com os seus dias disponíveis, pronta para você compartilhar nos seus Stories e Status.
              </p>
            </div>

            {/* Lista de Recursos com Ícones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-purple-50/50 border border-purple-100/70 rounded-2xl p-5 text-left space-y-2 animate-story-card opacity-0">

                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FaBolt className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-purple-950 font-lexend">
                  Pronto em 1 Toque
                </h3>
                <p className="text-xs text-purple-900/70 leading-relaxed font-medium">
                  Sem precisar abrir o Canva ou editar fotos manualmente. O sistema desenha tudo sozinho.
                </p>
              </div>

              <div className="bg-purple-50/50 border border-purple-100/70 rounded-2xl p-5 text-left space-y-2 animate-story-card opacity-0">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FaInstagram className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-purple-950 font-lexend">
                  Stories & Status
                </h3>
                <p className="text-xs text-purple-900/70 leading-relaxed font-medium">
                  Formato vertical ideal para postar onde suas Poderosas mais passam tempo todos os dias.
                </p>
              </div>

              <div className="bg-purple-50/50 border border-purple-100/70 rounded-2xl p-5 text-left space-y-2 animate-story-card opacity-0">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FaCalendarCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-purple-950 font-lexend">
                  Espaço Sempre Cheio
                </h3>
                <p className="text-xs text-purple-900/70 leading-relaxed font-medium">
                  Suas clientes veem quando você tem vaga disponível e te chamam direto para agendar.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
