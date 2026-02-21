'use client'

import { resetPasswordAction, sendForgotPasswordEmailAction, signInUserAction } from "@/actions/auth";
import { HttpStatusEnum } from "@/commons/enums/http";
import { ForgotPasswordFormInputs, OtpFormInputs, SendEmailFormInputs, UserSignInFormInputs } from "@/commons/models/user";
import { SignInStepType } from "@/commons/types/step";
import { ConfirmEmailForm } from "@/components/forms/confirm-email-form";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { SignInForm } from "@/components/forms/signin-form";
import { useProfileStore } from "@/store/use-profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SignInFlow() {
  const route = useRouter()
  const [step, setStep] = useState<SignInStepType>('login')
  const [email, setEmail] = useState('')
  const setProfile = useProfileStore((state) => state.setProfile)

  const signInUser = async (data: UserSignInFormInputs) => {
    try {
      const response = await signInUserAction(data)
      if (response.status === HttpStatusEnum.Ok && response.data?.user) {
        setProfile({
          id: response.data.user.id,
          email: response.data.user.email || '',
          name: response.data.user.user_metadata.display_name,
          avatarUrl: null,
          createdAt: response.data.user.created_at.toString(),
          updatedAt: response.data.user.updated_at?.toString() || response.data.user.created_at.toString(),
        })
        route.push('/painel')
        return
      }

      toast.error(response.message)
    } catch {
      toast.error('Ocorreu um erro ao entrar na sua conta. Por favor, tente novamente mais tarde.');
    }
  }

  const sendEmailUser = async (data: SendEmailFormInputs) => {
    try {
      const response = await sendForgotPasswordEmailAction(data.email)
      toast.success(response.message)
      setStep('forgot-password')
      setEmail(data.email)
    } catch {
      toast.error('Ocorreu um erro ao enviar o e-mail de recuperação. Por favor, tente novamente mais tarde.')
    }
  }

  const verifyCode = async (data: OtpFormInputs) => {
    // Lógica para verificar o código OTP
    // Se for válido, redirecionar para a página de redefinição de senha
    // Caso contrário, exibir uma mensagem de erro
  }

  const forgotPassword = async (data: ForgotPasswordFormInputs) => {
    try {
      const response = await resetPasswordAction(email, data)
      if (response.status === HttpStatusEnum.Ok) {
        toast.success(response.message)
        return
      }
      toast.error(response.message)
    } catch {
      toast.error('Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente mais tarde.')
    }
  }
  
  return (
     <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {step === 'login' ? (
          <SignInForm signInUser={signInUser} sendEmailUser={sendEmailUser}/>
        ) : step === 'forgot-password' ? (
          <ForgotPasswordForm forgotPassword={forgotPassword} />
        ) : (
          <ConfirmEmailForm verifyCode={verifyCode} />
        )}
      </div>
    </div>
  )
}