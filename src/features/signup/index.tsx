'use client'

import { signUpUserAction, verifyOtpCodeAction } from "@/actions/auth";
import { validateInvitationAction } from "@/actions/invitation";
import { joinWaitlistAction } from "@/actions/waitlist";
import { HttpStatusEnum } from "@/commons/enums/http";
import { OtpFormInputs, UserSignUpFormInputs } from "@/commons/models/user";
import { PlanInvitationFormatted } from "@/commons/models/invitation";
import { SignUpStepType } from "@/commons/types/step";
import { loadingToast, updateToast } from "@/commons/utils/toast-handler";
import { ConfirmEmailForm } from "@/components/forms/auth/confirm-email-form";
import { SignupForm } from "@/components/forms/auth/signup-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { 
  FaCrown, 
  FaLock, 
  FaWhatsapp, 
  FaEnvelope, 
  FaUser, 
  FaCheck, 
  FaWandMagicSparkles, 
  FaArrowLeft, 
  FaArrowRight 
} from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";
import { toast } from "sonner";
import Link from "next/link";

export function SignUpFlow() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const inviteTokenParam = searchParams.get('convite');

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<SignUpStepType>('register');
  const [inviteToken, setInviteToken] = useState<string | null>(inviteTokenParam);
  const [invitation, setInvitation] = useState<PlanInvitationFormatted | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(!!inviteTokenParam);

  // Estados do formulário de lista de espera para quem não tem convite
  const [isWaitlistPending, startWaitlistTransition] = useTransition();
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistPhone, setWaitlistPhone] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWaitlistPhone(formatPhone(e.target.value));
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!waitlistName.trim()) {
      toast.error("Por favor, digite seu nome.");
      return;
    }

    const cleanPhone = waitlistPhone.replace(/\D/g, "");
    if (!cleanPhone && !waitlistEmail.trim()) {
      toast.error("Informe seu WhatsApp ou E-mail para avisarmos você.");
      return;
    }

    startWaitlistTransition(async () => {
      const res = await joinWaitlistAction({
        name: waitlistName.trim(),
        phone: cleanPhone || null,
        email: waitlistEmail.trim() || null,
        origin: "signup_direct",
      });

      if (res.status === HttpStatusEnum.Created || res.status === HttpStatusEnum.Ok) {
        setWaitlistSuccess(true);
        toast.success(res.message);
      } else {
        toast.error(res.message || "Erro ao salvar na lista de espera.");
      }
    });
  };

  useEffect(() => {
    if (inviteTokenParam) {
      setInviteToken(inviteTokenParam);
      validateInvitationAction(inviteTokenParam).then((res) => {
        if (res.data && res.data.isAvailable) {
          setInvitation(res.data);
        }
        setIsValidating(false);
      });
    } else {
      setIsValidating(false);
    }
  }, [inviteTokenParam]);

  // Passo 1: Cadastro das credenciais (E-mail e Senha)
  const signUpUser = async (data: UserSignUpFormInputs) => {
    const toastId = loadingToast('Criando seu espaço...');
    try {
      const response = await signUpUserAction(data, inviteToken || undefined);
      updateToast(toastId, response.status, response.message);

      if (response.status === HttpStatusEnum.Ok) {
        setEmail(data.email);
        setStep('verify');
      }
    } catch {
      updateToast(toastId, HttpStatusEnum.InternalServerError);
    }
  };

  // Passo 1b: Confirmação do OTP de verificação
  const verifyCode = async (data: OtpFormInputs) => {
    const toastId = loadingToast('Verificando código de acesso...');
    try {
      const response = await verifyOtpCodeAction(email, data.code, inviteToken || undefined);
      updateToast(toastId, response.status, response.message);

      if (response.status === HttpStatusEnum.Ok) {
        // Redireciona diretamente para o painel com o espaço ativado
        route.push('/painel');
      }
    } catch {
      updateToast(toastId, HttpStatusEnum.InternalServerError);
    }
  };

  // Se estiver validando o token do convite
  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <Spinner className="w-8 h-8 text-purple-700" />
        <p className="text-sm font-semibold text-purple-900/70">
          Verificando seu convite VIP...
        </p>
      </div>
    );
  }

  // Se NÃO houver convite ou o convite for inválido/esgotado -> Exibe tela de Acesso Restrito & Lista de Espera
  if (!invitation) {
    return (
      <div className="w-full max-w-xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
        <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-purple-950/5 text-center space-y-6">
          
          {/* Cabeçalho do Card */}
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto shadow-inner">
              <FaLock className="w-6 h-6 text-purple-700" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider">
              <FaCrown className="w-3.5 h-3.5 text-amber-500" />
              Fase Alpha Fechada
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-purple-950 font-lexend tracking-tight">
              Acesso Exclusivo por Convite
            </h2>

            <p className="text-sm text-purple-900/70 font-medium leading-relaxed max-w-md mx-auto">
              Neste momento, a Luluzinha está aberta apenas para manicures participantes dos testes fechados.
            </p>
          </div>

          {/* Estado de Sucesso na Lista de Espera */}
          {waitlistSuccess ? (
            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <FaCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-purple-950 font-lexend">
                  Lugar garantido, {waitlistName.split(" ")[0]}!
                </h3>
                <p className="text-xs text-purple-900/70 leading-relaxed max-w-sm mx-auto">
                  Você receberá um convite especial com prioridade no seu WhatsApp assim que liberarmos as vagas do <strong>Beta Público</strong>.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full border-purple-200 text-purple-900 font-bold text-xs">
                <Link href="/">
                  <FaArrowLeft className="w-3 h-3 mr-1.5" />
                  Voltar para o início
                </Link>
              </Button>
            </div>
          ) : (
            /* Formulário da Lista de Espera */
            <div className="bg-purple-50/40 border border-purple-100/70 rounded-2xl p-5 sm:p-6 text-left space-y-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-purple-950 font-lexend flex items-center justify-center sm:justify-start gap-1.5">
                  <FaWandMagicSparkles className="w-3.5 h-3.5 text-purple-700" />
                  Quer testar no Beta Público?
                </h3>
                <p className="text-xs text-purple-900/60 font-medium">
                  Cadastre-se na Lista de Espera VIP e seja avisada com prioridade no WhatsApp:
                </p>
              </div>

              <form onSubmit={handleWaitlistSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="signup-waitlist-name" className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <FaUser className="w-3 h-3 text-purple-600" />
                    Seu Nome
                  </Label>
                  <Input
                    id="signup-waitlist-name"
                    placeholder="Ex: Camila Santos"
                    value={waitlistName}
                    onChange={(e) => setWaitlistName(e.target.value)}
                    disabled={isWaitlistPending}
                    className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-10 text-sm bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-waitlist-phone" className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <FaWhatsapp className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp
                  </Label>
                  <Input
                    id="signup-waitlist-phone"
                    placeholder="(00) 00000-0000"
                    value={waitlistPhone}
                    onChange={handlePhoneChange}
                    disabled={isWaitlistPending}
                    type="tel"
                    className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-10 text-sm bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-waitlist-email" className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <FaEnvelope className="w-3 h-3 text-purple-600" />
                    E-mail (Opcional)
                  </Label>
                  <Input
                    id="signup-waitlist-email"
                    placeholder="exemplo@email.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    disabled={isWaitlistPending}
                    type="email"
                    className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-10 text-sm bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isWaitlistPending}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-full font-bold h-11 text-sm shadow-md shadow-purple-900/15"
                >
                  {isWaitlistPending ? "Guardando seu lugar..." : "Entrar na Lista de Espera VIP"}
                </Button>
              </form>
            </div>
          )}

          {/* Links Auxiliares */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-purple-100 text-purple-900/70">
            <Link
              href="/"
              className="hover:text-purple-950 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <FaArrowLeft className="w-3 h-3" />
              Voltar para o início
            </Link>

            <Link
              href="/entrar"
              className="text-purple-700 hover:text-purple-950 font-bold hover:underline inline-flex items-center gap-1"
            >
              Já é cadastrada? Entrar
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Se HOUVER convite VIP ativo -> Exibe fluxo de cadastro normal
  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-4">
      <div className="bg-linear-to-r from-purple-700 to-purple-900 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/15 text-amber-300">
            <FaCrown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
              <LuSparkles className="w-3 h-3 text-amber-300" />
              Convite VIP Ativo
            </p>

            <h4 className="text-sm sm:text-base font-extrabold text-white">
              {invitation.recipientName ? `Olá, ${invitation.recipientName}! ` : ''}30 dias de acesso 100% gratuito ao seu espaço digital
            </h4>
          </div>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-full text-purple-100">
          Fase Alpha
        </span>
      </div>

      {step === 'register' && (
        <SignupForm signUpUser={signUpUser} />
      )}

      {step === 'verify' && (
        <ConfirmEmailForm verifyCode={verifyCode} />
      )}
    </div>
  );
}