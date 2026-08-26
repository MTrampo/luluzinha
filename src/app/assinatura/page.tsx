import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FaCalendarDay, FaCalendarWeek, FaCashRegister, FaClockRotateLeft, FaHandcuffs, FaHandshakeSimple, FaMobileButton, FaPaintbrush, FaShareNodes } from "react-icons/fa6";
import { IoWomanSharp } from "react-icons/io5";
import { ButtonSubscription } from "@/components/buttons/subscription";

export default function Subscription() {
  return (
    <>
      <Header />
      <main className="mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl">
        <h1>Seja uma Fundadora</h1>
        <p>Tudo o que você precisa para dominar sua agenda e valorizar seu trabalho com o Plano Fundadoras, por apenas <span className="font-medium">R$ 9,90/mês</span> (oferta limitada).</p>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 my-6 gap-4">
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaCalendarWeek className="text-purple-900" />
                <CardTitle>Agenda de Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Agenda pessoal e ilimitada (gerenciada por você) com visão rápida do dia e da semana.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <IoWomanSharp className="text-purple-900" />
                <CardTitle>Minhas Poderosas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cadastro ilimitado de clientes para ter o contato de todas sempre à mão na bancada digital.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaCashRegister className="text-purple-900" />
                <CardTitle>Seu Caixa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Saiba exatamente quanto entrou na sua bancada com o Histórico de Recebíveis.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaPaintbrush className="text-purple-900" />
                <CardTitle>Procedimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cadastre até 6 procedimentos personalizados no seu menu com preço e duração.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaClockRotateLeft className="text-purple-900" />
                <CardTitle>Histórico de 1 Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Acompanhe a retenção do histórico de atendimentos e caixa por no máximo 1 mês.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaShareNodes className="text-purple-900" />
                <CardTitle>Compartilhar Horários</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compartilhe seus horários disponíveis de forma personalizada e acesse de qualquer celular, tablet ou PC.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div>
            <h3>
              Pagamento
            </h3>
            <p>Estrutura de pagamento seguro e protegido, gerenciado exclusivamente pelo <span className="font-medium">Mercado Pago</span>.</p>
            <div className="grid grid-cols-3 my-6 gap-4">
              <Card className="gap-1">
                <CardHeader className="flex items-center gap-1">
                  <FaHandshakeSimple className="text-purple-900" />
                  <CardTitle>Transparência</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Cobrança mensal recorrente, sem taxas escondidas ou letras miúdas.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="gap-1">
                <CardHeader className="flex items-center gap-1">
                  <FaHandcuffs className="text-purple-900" />
                  <CardTitle>Sem Fidelidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Cancele a qualquer momento, sem burocracia ou penalidades.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="gap-1">
                <CardHeader className="flex items-center gap-1">
                  <FaCalendarDay className="text-purple-900" />
                  <CardTitle>Data de Cobrança</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    A cobrança mensal será realizada sempre no mesmo dia em que você iniciou sua assinatura.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ButtonSubscription variant="theme" size="lg" className="w-full">
          TORNAR-ME UMA FUNDADORA
        </ButtonSubscription>
        <p className="text-muted-foreground text-sm leading-normal font-normal text-center">
          Ao assinar, você concorda com nossos <Link className="text-purple-950" href="/documento/termo">Termos de Serviço</Link>{" "}
          e <Link className="text-purple-950" href="/documento/politica">Política de Privacidade</Link>.
        </p>
      </main>
    </>
  )
}