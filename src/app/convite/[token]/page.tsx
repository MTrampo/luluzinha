import Header from "@/components/header";
import { validateInvitationAction, acceptInvitationRedirectAction } from "@/actions/invitation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FaCrown,
  FaCheck,
  FaClock,
  FaCircleXmark,
  FaGift,
  FaHeadset,
  FaShieldHeart,
  FaCalendarWeek,
  FaHeart
} from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";

import { setInvitationCookie } from "@/commons/lib/auth/invitation";

interface ConvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ConvitePage({ params }: ConvitePageProps) {
  const { token } = await params;
  const result = await validateInvitationAction(token);
  const invitation = result.data;
  const plan = invitation?.plan;

  const isInvalid = !invitation || !invitation.isAvailable;

  if (!isInvalid && invitation?.token) {
    await setInvitationCookie(invitation.token);
  }

  const errorMessage =
    result.message ||
    "Este convite VIP já foi utilizado por outra Luluzinha ou expirou após o prazo limite de 24 horas.";


  return (
    <>
      <Header />
      <main className="mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-5xl md:max-w-7xl">
        {isInvalid ? (
          /* Estado de Convite Expirado, Não Encontrado ou Já Utilizado */
          <div className="max-w-lg mx-auto py-12">
            <Card className="border border-purple-100 shadow-xl rounded-3xl overflow-hidden bg-white text-center p-6 sm:p-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <FaCircleXmark className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <CardTitle className="text-xl sm:text-2xl font-black text-purple-950">
                  Convite Indisponível
                </CardTitle>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button variant="theme" size="lg" className="w-full font-bold text-sm" asChild>
                  <Link href="/assinatura">
                    Conhecer Nossos Planos Oficiais
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                  <Link href="/">
                    Voltar para a Página Inicial
                  </Link>
                </Button>
              </div>
            </Card>

            <p className="text-muted-foreground text-xs leading-normal font-normal text-center mt-8">
              Ficou com alguma dúvida? Consulte nossos{" "}
              <Link className="text-purple-950 font-semibold underline underline-offset-2" href="/documento/termo">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link className="text-purple-950 font-semibold underline underline-offset-2" href="/documento/politica">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>
        ) : (
          /* Estado de Convite Válido e Especial */
          <>
            {/* Cabeçalho da Página VIP */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-purple-950 tracking-tight leading-tight">
                {invitation.recipientName ? `Bem-vinda, ${invitation.recipientName}!` : "Um convite especial para você brilhar"}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-gray-600 font-medium max-w-2xl mx-auto">
                Preparamos cada detalhe com muito carinho para que seu dia a dia seja mais leve, organizado e profissional. Você foi escolhida para inaugurar o nosso espaço digital.
              </p>
            </div>

            {/* Card Principal do Convite VIP */}
            <div className="max-w-2xl mx-auto">
              <Card className="relative border-2 border-purple-500 shadow-2xl shadow-purple-500/15 rounded-3xl overflow-hidden bg-white ring-4 ring-purple-100/60 transition-all">
                {/* Badge VIP Superior */}
                <div className="absolute top-0 right-0">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-bl-2xl text-xs font-black tracking-wide uppercase bg-linear-to-r from-purple-700 to-purple-900 text-white shadow-xs">
                    <FaCrown className="w-3 h-3 text-amber-300" />
                    Convite VIP Alpha
                  </span>
                </div>

                <CardHeader className="pt-10 pb-4 px-6 sm:px-10 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-100 to-purple-200 text-purple-800 flex items-center justify-center mx-auto shadow-inner">
                    <FaGift className="w-8 h-8 text-purple-700" />
                  </div>

                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
                      Acesso 100% Gratuito
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                      Sem necessidade de cartão de crédito para ativar o seu espaço.
                    </p>
                  </div>

                  {/* Valor Gratuito Destacado */}
                  <div className="pt-3 pb-1 flex flex-col items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-purple-900 tracking-tight">
                        R$ 0,00
                      </span>
                      <span className="text-sm sm:text-base font-bold text-gray-400">
                        / 30 dias
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full mt-3">
                      <FaClock className="w-3.5 h-3.5 text-amber-600" />
                      Convite válido por 24 horas para ativação
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-6 sm:px-10 pb-8">
                  <div className="border-t border-purple-100/80 pt-6 flex flex-col gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-950/70">
                      Tudo o que está incluído no seu acesso VIP:
                    </span>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(plan?.features && plan.features.length > 0
                        ? plan.features
                        : [
                          "Agenda de atendimentos pessoal e ilimitada",
                          "Cadastro ilimitado de Poderosas (clientes)",
                          "Seu Caixa (Histórico de Recebíveis)",
                          "Menu com até 6 procedimentos personalizados",
                          "Compartilhamento rápido de dias livres para Stories e Status",
                          "Onboarding completo para configurar seu espaço",

                          "Acesso prático pelo celular, tablet ou computador",
                          "Suporte VIP exclusivo direto no WhatsApp"
                        ]
                      ).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                          <div className="p-1 rounded-full bg-purple-100 text-purple-700 mt-0.5 shrink-0">
                            <FaCheck className="w-2.5 h-2.5" />
                          </div>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="px-6 sm:px-10 pb-10 pt-2 flex flex-col gap-4 bg-purple-50/20 border-t border-purple-50">
                  <form action={acceptInvitationRedirectAction} className="w-full">
                    <input type="hidden" name="token" value={invitation.token} />
                    <Button
                      type="submit"
                      variant="theme"
                      size="lg"
                      className="w-full font-bold text-sm sm:text-base tracking-wide shadow-lg active:scale-[0.99] transition-transform py-7 rounded-2xl cursor-pointer"
                    >
                      ACEITAR CONVITE E CRIAR MEU ESPAÇO
                    </Button>
                  </form>

                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    Ao aceitar este convite, você concorda com nossos{" "}
                    <Link className="text-purple-900 font-bold underline underline-offset-2 hover:text-purple-700" href="/documento/termo">
                      Termos de Serviço
                    </Link>{" "}
                    e{" "}
                    <Link className="text-purple-900 font-bold underline underline-offset-2 hover:text-purple-700" href="/documento/politica">
                      Política de Privacidade
                    </Link>
                    .
                  </p>
                </CardFooter>

              </Card>
            </div>

            {/* Seção de Benefícios e Confiança Exclusiva do Alpha */}
            <div className="mt-14 sm:mt-20 pt-10 border-t border-purple-100/80 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-900 mb-1">
                  <FaShieldHeart className="w-3.5 h-3.5 text-pink-600" />
                  Nossa Parceria com Você
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-purple-950">
                  Por que o seu teste Alpha é tão especial para nós?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Estamos construindo o Luluzinha ouvindo de perto a sua rotina real de atendimento.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border border-purple-100/60 bg-white/80 shadow-2xs">
                  <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-5">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-900 shrink-0">
                      <FaHeart className="w-4 h-4 text-pink-600" />
                    </div>
                    <CardTitle className="text-sm sm:text-base font-bold text-purple-950">
                      Zero Cobranças
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-5 pt-0">
                    <CardDescription className="text-xs sm:text-sm text-gray-500 leading-normal">
                      Não pedimos cartão de crédito. Você testa tudo com total liberdade e tranquilidade.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-purple-100/60 bg-white/80 shadow-2xs">
                  <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-5">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-900 shrink-0">
                      <FaCalendarWeek className="w-4 h-4 text-purple-700" />
                    </div>
                    <CardTitle className="text-sm sm:text-base font-bold text-purple-950">
                      Onboarding Guiado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-5 pt-0">
                    <CardDescription className="text-xs sm:text-sm text-gray-500 leading-normal">
                      Assim que criar sua conta, guiamos você passo a passo para configurar o seu espaço em 1 minuto.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border border-purple-100/60 bg-white/80 shadow-2xs">
                  <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-5">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-900 shrink-0">
                      <FaHeadset className="w-4 h-4 text-purple-700" />
                    </div>
                    <CardTitle className="text-sm sm:text-base font-bold text-purple-950">
                      Suporte Direto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-5 pb-5 pt-0">
                    <CardDescription className="text-xs sm:text-sm text-gray-500 leading-normal">
                      Canal exclusivo no WhatsApp para tirar dúvidas e sugerir melhorias diretamente para a equipe.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Rodapé Legal */}
            <p className="text-muted-foreground text-xs leading-normal font-normal text-center mt-12">
              Luluzinha © 2026 • Seu espaço digital feito com carinho para valorizar o seu trabalho.
            </p>
          </>
        )}
      </main>
    </>
  );
}
