'use client'

import { signUpUserAction, verifyOtpCodeAction } from "@/actions/auth";
import { validateInvitationAction } from "@/actions/invitation";
import { HttpStatusEnum } from "@/commons/enums/http";
import { OtpFormInputs, UserSignUpFormInputs } from "@/commons/models/user";
import { PlanInvitationFormatted } from "@/commons/models/invitation";
import { SignUpStepType } from "@/commons/types/step";
import { loadingToast, updateToast } from "@/commons/utils/toast-handler";
import { ConfirmEmailForm } from "@/components/forms/auth/confirm-email-form";
import { SignupForm } from "@/components/forms/auth/signup-form";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  FaCrown,
  FaHeart
} from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";
import { toast } from "sonner";

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

  useEffect(() => {
    const activeToken = initialToken || inviteTokenParam;
    if (activeToken) {
      setInviteToken(activeToken);
      setIsValidating(true);
      validateInvitationAction(activeToken).then((res) => {
        if (res.data && res.data.isAvailable) {
          setInvitation(res.data);
        } else {
          toast.error(res.message || "Este convite VIP já foi utilizado por outra Poderosa ou expirou.");
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
        // Redireciona para o painel (o middleware direciona para assinatura caso necessário)
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Banner de Boas-Vindas e Destaque da Degustação */}
      {invitation ? (
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
                {invitation.recipientName ? `Olá, ${invitation.recipientName}! ` : ''}7 dias de acesso 100% gratuito ao seu espaço digital
              </h4>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-full text-purple-100">
            Convite Especial
          </span>
        </div>
      ) : (
        <div className="bg-linear-to-r from-purple-700 via-purple-800 to-purple-900 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/15 text-pink-300">
              <FaHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-1.5">
                <LuSparkles className="w-3 h-3 text-amber-300" />
                Seu Espaço Digital
              </p>

              <h4 className="text-sm sm:text-base font-extrabold text-white">
                Crie sua conta e aproveite 7 dias grátis para experimentar
              </h4>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-full text-purple-100">
            Sem Fidelidade
          </span>
        </div>
      )}

      {step === 'register' && (
        <SignupForm signUpUser={signUpUser} />
      )}

      {step === 'verify' && (
        <ConfirmEmailForm verifyCode={verifyCode} />
      )}
    </div>
  );
}