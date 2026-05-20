"use client"

import { User } from "@supabase/supabase-js"
import Header from "@/components/header/dashboard"
import { StandardAvatar } from "@/components/avatar"
import { formatDate } from "@/commons/utils/format"
import { FaUser, FaEnvelope, FaCalendarAlt, FaKey, FaEye, FaEyeSlash, FaCrown, FaCheck, FaInfoCircle } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { sendForgotPasswordEmailAction, resetPasswordAction } from "@/actions/auth"
import { CustomSheet } from "@/components/sheets/custom-sheet"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group"
import { HttpStatusEnum } from "@/commons/enums/http"
import { getSubscriptionStatus } from "@/components/maps/status-map"
import { SubscriptionFormatted } from "@/commons/models/subscription"

type AccountProps = {
  user: User
  subscription: SubscriptionFormatted | null
}

export default function Account({ user, subscription }: AccountProps) {
  const name = user.user_metadata?.display_name || "Usuária"
  const initials = name.slice(0, 2).toUpperCase()
  const memberSince = user.created_at ? formatDate(user.created_at) : "N/A"

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"idle" | "code_sent">("idle")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleStartReset = async () => {
    if (!user.email) return

    setLoading(true)
    try {
      const response = await sendForgotPasswordEmailAction(user.email)
      if (response.status === HttpStatusEnum.Ok) {
        toast.success("Prontinho! Enviamos um código de verificação para o seu e-mail.")
        setStep("code_sent")
        setIsSheetOpen(true)
      } else {
        toast.error(response.message || "Ocorreu um erro ao enviar o e-mail de recuperação.")
      }
    } catch (err) {
      toast.error("Ocorreu um erro ao enviar o e-mail de recuperação. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user.email || !code || !password) return

    setLoading(true)
    try {
      const response = await resetPasswordAction(user.email, {
        code,
        password
      })

      if (response.status === HttpStatusEnum.Ok) {
        toast.success("Sua senha foi alterada com sucesso!")
        setIsSheetOpen(false)
        setStep("idle")
        setCode("")
        setPassword("")
      } else {
        toast.error(response.message || "Código inválido ou erro ao alterar a senha.")
      }
    } catch (err) {
      toast.error("Erro ao alterar sua senha. Por favor, verifique o código e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header title="Minha Conta" />
      <div className="main-content">
        <div className="w-full space-y-6">
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row gap-6 items-center border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-md transition-all duration-300">
            <StandardAvatar size="xl" initials={initials} className="w-20 h-20 sm:w-24 sm:h-24" />

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h2 className="text-xl font-bold text-purple-900 truncate">
                {name}
              </h2>
              <span className="text-sm text-gray-500 font-medium truncate block mt-1">
                {user.email}
              </span>
              <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-600 border border-purple-100 mt-2">
                Luluzinha Parceira
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Info Card */}
            <div className="border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-md transition-all duration-300 space-y-4">
              <h3 className="text-lg font-bold text-purple-900 border-b border-purple-50 pb-2">
                Informações Pessoais
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-md">
                  <div className="text-purple-600">
                    <FaUser size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-black tracking-wider text-gray-400">Nome de Exibição</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-md">
                  <div className="text-purple-600">
                    <FaEnvelope size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-black tracking-wider text-gray-400">E-mail de Cadastro</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-md">
                  <div className="text-purple-600">
                    <FaCalendarAlt size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-black tracking-wider text-gray-400">Membro Desde</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{memberSince}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings / Security Card */}
            <div className="border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-md transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-purple-900 border-b border-purple-50 pb-2">
                  Segurança da Conta
                </h3>

                <div className="flex items-start gap-3 bg-purple-50/50 p-4 rounded-md">
                  <div className="text-purple-600 mt-1">
                    <FaKey size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Senha e Autenticação</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Recomendamos alterar sua senha periodicamente para manter a segurança do seu caixa e agendamentos sempre protegidos.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 rounded-md"
                onClick={handleStartReset}
                disabled={loading}
              >
                {loading && step === "idle" ? "Enviando e-mail..." : "Alterar Senha"}
              </Button>
            </div>

            {/* Seu Plano de Assinatura Card */}
            <div className="border border-purple-50 hover:border-purple-200 shadow-sm hover:shadow-md bg-white/80 backdrop-blur-sm p-6 rounded-md transition-all duration-300 flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-purple-50 pb-2">
                  <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                    Assinatura
                  </h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${getSubscriptionStatus(subscription?.mpStatus).className}`}>
                    {subscription?.mpStatusFormatted}
                  </span>
                </div>

                {subscription ? (
                  <div className="space-y-4">
                    <div className="bg-purple-50/50 p-3 rounded-md">
                      <p className="text-[10px] uppercase font-black tracking-wider text-gray-400">Plano Atual</p>
                      <p className="text-sm font-bold text-purple-900">
                        {subscription.planName || "Luluzinha"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-50/50 p-3 rounded-md">
                        <p className="text-[10px] uppercase font-black tracking-wider text-gray-400">Valor</p>
                        <p className="text-xs font-semibold text-gray-900">
                          {subscription.baseValueFormatted}
                        </p>
                      </div>

                      <div className="bg-purple-50/50 p-3 rounded-md">
                        <p className="text-[10px] uppercase font-black tracking-wider text-gray-400">
                          {subscription.mpStatus === "cancelled" ? "Cancelado em" : "Renovação"}
                        </p>
                        <p className="text-xs font-semibold text-gray-900">
                          {subscription.currentPeriodEndFormatted || "N/A"}
                        </p>
                      </div>
                    </div>

                    {subscription.mpPayerEmail && (
                      <div className="bg-purple-50/50 p-3 rounded-md">
                        <p className="text-[10px] uppercase font-black tracking-wider text-gray-400">E-mail de Cobrança (MP)</p>
                        <p className="text-xs font-semibold text-gray-700 truncate">{subscription.mpPayerEmail}</p>
                      </div>
                    )}

                    {/* Plano Limits List */}
                    <div className="pt-1">
                      <p className="text-xs font-bold text-purple-950 mb-2">Vantagens Ativas na sua Bancada:</p>
                      <ul className="text-xs text-gray-600 space-y-1.5 pl-1">
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-purple-600 shrink-0" size={10} />
                          <span><strong>Menu de Procedimentos:</strong> até 6 serviços cadastrados</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-purple-600 shrink-0" size={10} />
                          <span><strong>Agenda de Atendimentos:</strong> completa e ilimitada</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheck className="text-purple-600 shrink-0" size={10} />
                          <span><strong>Histórico da Bancada:</strong> últimos 30 dias de registros</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-2">
                    <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-md border border-amber-100">
                      <FaInfoCircle className="text-amber-600 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-amber-900">Bancada sem Assinatura</h4>
                        <p className="text-[11px] text-amber-700 leading-relaxed">
                          Bem-vinda à sua nova bancada digital. Preparamos cada detalhe com muito carinho para que seu dia a dia seja mais leve e profissional. Assine o plano para liberar todos os recursos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {subscription?.mpStatus !== "authorized" && (
                <Button
                  onClick={() => window.location.href = "/assinatura"}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                  Tornar-me uma Luluzinha
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Sheet */}
      <CustomSheet
        title="Redefinir Senha"
        description="Digite o código enviado para o seu e-mail e escolha sua nova senha."
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open)
          if (!open) setStep("idle")
        }}
      >
        <form onSubmit={handleSubmitReset} className="space-y-6 mt-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp-code">Código de Verificação</FieldLabel>
              <Input
                id="otp-code"
                type="text"
                placeholder="Insira o código enviado por e-mail"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="rounded-md border-purple-100 focus:border-purple-300"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="new-password">Nova Senha</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Escolha uma senha forte"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md border-purple-100 focus:border-purple-300"
                />
                <InputGroupAddon
                  align="inline-end"
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEye className="text-gray-400" />
                  ) : (
                    <FaEyeSlash className="text-gray-400" />
                  )}
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md mt-4"
              disabled={loading}
            >
              {loading ? "Confirmando..." : "Confirmar Nova Senha"}
            </Button>
          </FieldGroup>
        </form>
      </CustomSheet>
    </>
  )
}
