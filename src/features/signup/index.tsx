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
  FaArrowRight,
  FaHeart
} from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";
import { toast } from "sonner";
import Link from "next/link";

interface SignUpFlowProps {
  initialToken?: string;
}

export function SignUpFlow({ initialToken }: SignUpFlowProps) {
  const route = useRouter();
  const searchParams = useSearchParams();
  const inviteTokenParam = initialToken || searchParams.get('convite');

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<SignUpStepType>('register');
  const [inviteToken, setInviteToken] = useState<string | null>(inviteTokenParam || null);
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
    const activeToken = initialToken || inviteTokenParam;
    if (activeToken) {
      setInviteToken(activeToken);
      setIsValidating(true);
      validateInvitationAction(activeToken).then((res) => {
        if (res.data && res.data.isAvailable) {
          setInvitation(res.data);
        }
        setIsValidating(false);
      });
    } else {
      setIsValidating(false);
    }
  }, [initialToken, inviteTokenParam]);


  // Passo 1: Cadastro das credenciais (E-mail e Senha)
  const signUpUser = async (data: UserSignUpFormInputs) => {
    const toastId = loadingToast('Criando seu espaço...');
    try {
      const response = await signUpUserAction(data, inviteToken || undefined);

      if (response.status === HttpStatusEnum.Ok && response.data) {
        updateToast(toastId, response.status, response.message);
        setEmail(data.email);
        setStep('verify');
      } else {
        updateToast(toastId, response.status, response.message);
      }
    } catch {
      updateToast(toastId, HttpStatusEnum.InternalServerError);
    }
  };

  // Passo 2: Verificação do código OTP enviado no e-mail
  const verifyCode = async (data: OtpFormInputs) => {
    const toastId = loadingToast('Confirmando seu código...');
    try {
      const response = await verifyOtpCodeAction(email, data.code, inviteToken || undefined);

      if (response.status === HttpStatusEnum.Ok) {
        updateToast(toastId, response.status, response.message);
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
      <div className="w-full max-w-lg mx-auto space-y-4 animate-in fade-in duration-300">
        <div className="bg-white border border-purple-100/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl shadow-purple-950/5 text-center space-y-5 sm:space-y-6">
          
          {/* Cabeçalho Acolhedor */}
          <div className="space-y-2.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto shadow-inner">
              <FaLock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider">
              <FaCrown className="w-3.5 h-3.5 text-amber-500" />
              Fase Alpha Fechada
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-purple-950 font-lexend tracking-tight">
              Acesso Exclusivo por Convite
            </h2>

            <p className="text-xs sm:text-sm text-purple-900/75 font-medium leading-relaxed max-w-md mx-auto">
              Estamos preparando cada detalhe com muito carinho e realizando testes fechados com manicures convidadas para valorizar a sua rotina real de atendimento.
            </p>
          </div>

          {/* Estado de Sucesso ou Formulário da Lista de Espera */}
          {waitlistSuccess ? (
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-6 sm:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <FaCheck className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
                  <FaHeart className="w-3 h-3 text-pink-600" />
                  Prioridade Garantida
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-purple-950 font-lexend">
                  Que alegria ter você com a gente, {waitlistName.split(" ")[0]}!
                </h3>
                <p className="text-xs sm:text-sm text-purple-900/80 leading-relaxed max-w-md mx-auto">
                  Seu lugar no <strong>Beta Público</strong> está guardado com muito carinho. Assim que liberarmos os novos acessos, você será uma das primeiras a receber o convite VIP direto no seu WhatsApp para transformar o seu espaço.
                </p>
              </div>

              <div className="pt-2">
                <Button asChild variant="default" className="w-full rounded-xl font-bold text-sm sm:text-base h-12 shadow-md">
                  <Link href="/">
                    Conhecer Mais Sobre a Luluzinha
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-purple-50/50 border border-purple-100/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left space-y-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 uppercase tracking-wide">
                  <FaWandMagicSparkles className="w-3.5 h-3.5 text-purple-700" />
                  Lista de Espera VIP
                </div>
                <h3 className="text-base sm:text-lg font-bold text-purple-950 font-lexend">
                  Garanta seu lugar no Beta Público
                </h3>
                <p className="text-xs text-purple-900/70 font-medium leading-relaxed">
                  Sabemos o quanto o seu tempo e o seu talento são especiais. Deixe seu contato para receber um convite VIP prioritário assim que abrirmos as novas vagas:
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
                    className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-11 text-sm bg-white"
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
                    className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-11 text-sm bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-waitlist-email" className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                    <FaEnvelope className="w-3.5 h-3.5 text-purple-600" />
                    E-mail (Opcional)
                  </Label>
                  <Input
                    id="signup-waitlist-email"
                    placeholder="exemplo@email.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    disabled={isWaitlistPending}
                    type="email"
                    className="rounded-xl border-purple-200 focus-visible:ring-purple-600 h-11 text-sm bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isWaitlistPending}
                  className="w-full bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold h-12 text-sm sm:text-base shadow-md shadow-purple-950/10 active:scale-[0.99] transition-transform cursor-pointer"
                >
                  {isWaitlistPending ? "Guardando seu lugar..." : "Quero Meu Acesso VIP"}
                </Button>
              </form>
            </div>
          )}

          {/* Links Auxiliares sem duplicações */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-purple-100 text-purple-900/70">
            {!waitlistSuccess ? (
              <>
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
              </>
            ) : (
              <div className="w-full text-center">
                <Link
                  href="/entrar"
                  className="text-purple-700 hover:text-purple-950 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Já possui uma conta ativa? Acessar meu espaço
                  <FaArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // Se HOUVER convite VIP ativo -> Exibe fluxo de cadastro normal
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
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