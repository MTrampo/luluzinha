'use client'

import { signUpUserAction, verifyOtpCodeAction } from "@/actions/auth";
import { HttpStatusEnum } from "@/commons/enums/http";
import { OtpFormInputs, UserSignUpFormInputs } from "@/commons/models/user";
import { SignUpStepType } from "@/commons/types/step";
import { loadingToast, updateToast } from "@/commons/utils/toast-handler";
import { ConfirmEmailForm } from "@/components/forms/confirm-email-form";
import { SignupForm } from "@/components/forms/signup-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpFlow() {
  const route = useRouter()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<SignUpStepType>('subscription')

  const signUpUser = async (data: UserSignUpFormInputs) => {
    const toastId = loadingToast('Criando seu espaço...');
    try {
      const response = await signUpUserAction(data)
      updateToast(toastId, response.status, response.message);
      
      if (response.status === HttpStatusEnum.Ok) {
        setEmail(data.email)
        setStep('verify')
      }
    } catch {
      updateToast(toastId, HttpStatusEnum.InternalServerError);
    }
  }

  const verifyCode = async (data: OtpFormInputs) => {
    const toastId = loadingToast('Criando seu espaço...');
    try {
      const response = await verifyOtpCodeAction(email, data.code)
      updateToast(toastId, response.status, response.message);
      route.push('/assinatura')
    } catch {
      updateToast(toastId, HttpStatusEnum.InternalServerError);
    }
  }

  return (
     <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {step === 'register' ? (
          <SignupForm signUpUser={signUpUser} />
        ) : (
          <ConfirmEmailForm verifyCode={verifyCode} />
        )}
      </div>
    </div>
  )
}