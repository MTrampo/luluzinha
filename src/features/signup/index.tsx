'use client'

import { signUpUserAction, verifyOtpCodeAction } from "@/actions/auth";
import { HttpStatusEnum } from "@/commons/enums/http";
import { OtpFormInputs, UserSignUpFormInputs } from "@/commons/models/user";
import { SignUpStepType } from "@/commons/types/step";
import { loadingToast, updateToast } from "@/commons/utils/toast-handler";
import { ConfirmEmailForm } from "@/components/forms/auth/confirm-email-form";
import { SignupForm } from "@/components/forms/auth/signup-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpFlow() {
  const route = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<SignUpStepType>('register');

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
      const response = await verifyOtpCodeAction(email, data.code);
      updateToast(toastId, response.status, response.message);

      if (response.status === HttpStatusEnum.Ok) {
        // Redireciona diretamente para a tela de assinatura
        route.push('/assinatura');
      }
    } catch {
      updateToast(toastId, HttpStatusEnum.InternalServerError);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      {step === 'register' && (
        <SignupForm signUpUser={signUpUser} />
      )}

      {step === 'verify' && (
        <ConfirmEmailForm verifyCode={verifyCode} />
      )}
    </div>
  );
}