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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCrown } from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";


export function SignUpFlow() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const inviteTokenParam = searchParams.get('convite');

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<SignUpStepType>('register');
  const [inviteToken, setInviteToken] = useState<string | null>(inviteTokenParam);
  const [invitation, setInvitation] = useState<PlanInvitationFormatted | null>(null);

  useEffect(() => {
    if (inviteTokenParam) {
      setInviteToken(inviteTokenParam);
      validateInvitationAction(inviteTokenParam).then((res) => {
        if (res.data && res.data.isAvailable) {
          setInvitation(res.data);
        }
      });
    }
  }, [inviteTokenParam]);

  // Passo 1: Cadastro das credenciais (E-mail e Senha)
  const signUpUser = async (data: UserSignUpFormInputs) => {
    const toastId = loadingToast('Criando seu espaço...');
    try {
      const response = await signUpUserAction(data);
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
        // Se utilizou convite Alpha, a assinatura já foi ativada -> direto para o /painel
        if (inviteToken) {
          route.push('/painel');
        } else {
          // Sem convite -> direciona para escolher plano
          route.push('/assinatura');
        }
      }
    } catch {
      updateToast(toastId, HttpStatusEnum.InternalServerError);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-4">
      {invitation && (
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