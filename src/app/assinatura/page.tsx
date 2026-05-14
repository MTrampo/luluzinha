import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FaCalendarDay, FaCalendarWeek, FaCashRegister, FaClockRotateLeft, FaHandcuffs, FaHandshakeSimple, FaMobileButton, FaPaintbrush } from "react-icons/fa6";
import { IoWomanSharp } from "react-icons/io5";
import { ButtonSubscription } from "@/components/buttons/subscription";

export default function Subscription() {
  return (
    <>
      <Header />
      <main className="mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl">
        <h1>Seja uma Luluzinha</h1>
        <p>Tudo o que você precisa para dominar sua agenda e valorizar seu trabalho, por apenas <span className="font-medium">R$ 9,90/mês</span>.</p>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 my-6 gap-4">
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaCalendarWeek className="text-purple-900" />
                <CardTitle>Agenda de Atendimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Marque seus serviços com visão da semana e do mês de forma rápida.
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
                  Cadastro completo das suas clientes para ter o contato de todas sempre à mão.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaCashRegister className="text-purple-900" />
                <CardTitle>Fluxo de Caixa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Saiba exatamente quanto entrou na sua bancada nos últimos 30 dias.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaPaintbrush className="text-purple-900" />
                <CardTitle>Menu de Procedimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cadastre seus 6 principais serviços com preço e tempo de duração.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaClockRotateLeft className="text-purple-900" />
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Acompanhe o histórico de agendamentos, pagamentos e serviços realizados por até 30 dias.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="gap-1">
              <CardHeader className="flex items-center gap-1">
                <FaMobileButton className="text-purple-900" />
                <CardTitle>Baixe o App</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Adicione o atalho na tela inicial do seu dispositivo para acessar sua agenda em qualquer lugar.
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
                  <CardTitle>Vencimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Todo dia 05, com 3 dias de carência para pagamento.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <ButtonSubscription variant="theme" size="lg" className="w-full">
          TORNAR-ME UMA LULUZINHA
        </ButtonSubscription>
        <p className="text-muted-foreground text-sm leading-normal font-normal text-center">
          Ao assinar, você concorda com nossos <Link className="text-purple-950" href="/documento/termo">Termos de Serviço</Link>{" "}
          e <Link className="text-purple-950" href="/documento/politica">Política de Privacidade</Link>.
        </p>
      </main>
    </>
  )
}