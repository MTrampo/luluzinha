"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  FaCrown, 
  FaWhatsapp, 
  FaCheck, 
  FaWandMagicSparkles, 
  FaEnvelope, 
  FaUser, 
  FaLock,
  FaArrowRight
} from "react-icons/fa6"
import { joinWaitlistAction } from "@/actions/waitlist"
import { HttpStatusEnum } from "@/commons/enums/http"
import { toast } from "sonner"
import Link from "next/link"

interface AlphaNoticeModalProps {
  isOpen: boolean
  onClose: () => void
  origin?: string
}

export function AlphaNoticeModal({ isOpen, onClose, origin = "landing_pricing" }: AlphaNoticeModalProps) {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11)
    if (raw.length <= 2) return raw
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Por favor, digite seu nome.")
      return
    }

    const cleanPhone = phone.replace(/\D/g, "")
    if (!cleanPhone && !email.trim()) {
      toast.error("Informe seu WhatsApp ou E-mail para entrarmos em contato.")
      return
    }

    startTransition(async () => {
      const response = await joinWaitlistAction({
        name: name.trim(),
        phone: cleanPhone || null,
        email: email.trim() || null,
        origin,
      })

      if (response.status === HttpStatusEnum.Created || response.status === HttpStatusEnum.Ok) {
        setIsSuccess(true)
        toast.success(response.message)
      } else {
        toast.error(response.message || "Não foi possível salvar na lista de espera.")
      }
    })
  }

  const handleClose = () => {
    onClose()
    // Reset state after transition
    setTimeout(() => {
      setIsSuccess(false)
      setName("")
      setPhone("")
      setEmail("")
    }, 300)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-100 sm:max-w-120 bg-white border-purple-100 rounded-3xl overflow-hidden p-0 gap-0 shadow-2xl">
        
        {/* Cabeçalho com Degradê Roxo Acolhedor */}
        <div className="bg-linear-to-br from-purple-800 via-purple-900 to-purple-950 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />
          
          <DialogHeader className="space-y-3 relative z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider w-fit">
              <FaCrown className="w-3.5 h-3.5" />
              Fase Alpha Fechada
            </div>

            <DialogTitle className="text-xl sm:text-2xl font-black text-white font-lexend leading-snug">
              Estamos em fase de testes exclusivos!
            </DialogTitle>

            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-medium">
              Preparamos cada detalhe com muito carinho. O acesso está liberado apenas para manicures convidadas. Quer ser avisada com prioridade na abertura do <strong>Beta Público</strong>?
            </p>
          </DialogHeader>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            /* Tela de Sucesso */
            <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <FaCheck className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-purple-950 font-lexend">
                  Prontinho, {name.split(" ")[0]}!
                </h3>
                <p className="text-sm text-purple-900/70 max-w-sm mx-auto leading-relaxed">
                  Seu nome já está na nossa <strong>Lista de Espera VIP</strong>. Assim que liberarmos as próximas vagas do Beta Público, você receberá um convite especial no WhatsApp.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleClose}
                  className="bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold px-8 py-5 shadow-md shadow-purple-900/15 w-full"
                >
                  Entendi, obrigada!
                </Button>
              </div>
            </div>
          ) : (
            /* Formulário da Lista de Espera */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <Label htmlFor="waitlist-name" className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <FaUser className="w-3 h-3 text-purple-600" />
                  Seu Nome
                </Label>
                <Input
                  id="waitlist-name"
                  placeholder="Ex: Amanda Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-11 text-sm bg-purple-50/30"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="waitlist-phone" className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <FaWhatsapp className="w-3.5 h-3.5 text-emerald-600" />
                  Seu WhatsApp (Principal para o convite)
                </Label>
                <Input
                  id="waitlist-phone"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={handlePhoneChange}
                  disabled={isPending}
                  type="tel"
                  className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-11 text-sm bg-purple-50/30"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Label htmlFor="waitlist-email" className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <FaEnvelope className="w-3 h-3 text-purple-600" />
                  Seu E-mail (Opcional)
                </Label>
                <Input
                  id="waitlist-email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  type="email"
                  className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-11 text-sm bg-purple-50/30"
                />
              </div>

              <div className="pt-3 space-y-3">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold h-12 text-sm shadow-md shadow-purple-900/15 transition-all"
                >
                  {isPending ? (
                    "Guardando seu lugar..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaWandMagicSparkles className="w-4 h-4 text-amber-300" />
                      Entrar na Lista de Espera VIP
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-purple-100 text-purple-900/70">
                  <span className="flex items-center gap-1 text-[11px]">
                    <FaLock className="w-2.5 h-2.5 text-purple-400" />
                    Seus dados estão protegidos
                  </span>
                  <Link
                    href="/entrar"
                    onClick={handleClose}
                    className="text-purple-700 hover:text-purple-950 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Já tem conta? Entrar
                    <FaArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            </form>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}
