'use client'

import { resetPasswordAction, sendForgotPasswordEmailAction, signInUserAction } from "@/actions/auth";
import { HttpStatusEnum } from "@/commons/enums/http";
import { ForgotPasswordFormInputs, OtpFormInputs, SendEmailFormInputs, UserSignInFormInputs } from "@/commons/models/user";
import { SignInStepType } from "@/commons/types/step";
import { ConfirmEmailForm } from "@/components/forms/confirm-email-form";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { SignInForm } from "@/components/forms/signin-form";
import { useProfileStore } from "@/store/use-profile";
import { useEstablishmentStore } from "@/store/use-establishment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { setEstablishmentCookie } from "@/commons/lib/auth/establishment";

export function SignInFlow() {
  const route = useRouter()
  const [step, setStep] = useState<SignInStepType>('login')
  const [email, setEmail] = useState('')
  const setProfile = useProfileStore((state) => state.setProfile)
  const setEstablishments = useEstablishmentStore((state) => state.setEstablishments)
  const setActiveEstablishment = useEstablishmentStore((state) => state.setActiveEstablishment)

  const signInUser = async (data: UserSignInFormInputs) => {
    try {
      const response = await signInUserAction(data)
      if (response.status === HttpStatusEnum.Ok && response.data?.user) {
        const { user, establishments, subscription, redirectPath } = response.data;
        const userId = user.id

        // 1. Salva o perfil
        setProfile({
          id: userId,
          email: user.email || '',
          name: user.user_metadata.display_name,
          avatarUrl: null,
          createdAt: user.created_at.toString(),
          updatedAt: user.updated_at?.toString() || user.created_at.toString(),
        })

        // 2. Salva estabelecimentos e define o ativo
        setEstablishments(establishments || [])

        let active = null
        if (Array.isArray(establishments) && establishments.length > 0) {
          active = establishments[0]
        }

        console.log('SignInFlow: establishments found:', establishments)
        console.log('SignInFlow: selected active establishment:', active)
        setActiveEstablishment(active)

        if (active) {
          await setEstablishmentCookie(active.id)
        }

        // 3. Redireciona conforme recomendado pelo servidor
        route.push(redirectPath)
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
      if (response.status !== HttpStatusEnum.Ok) {
        switch (response.status) {
          case HttpStatusEnum.Forbidden:
            toast.warning(response.message)
            break
          default:
            toast.error(response.message)
            break
        }
        return
      }

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

        // Melhoria: Realizar login automático após alteração de senha
        await signInUser({
          email,
          password: data.password
        })
        return
      }
      toast.error(response.message)
    } catch (error) {
      toast.error('Ocorreu um erro ao redefinir sua senha. Por favor, tente novamente mais tarde.')
      console.error('Error in forgotPassword:', error)
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {step === 'login' ? (
          <SignInForm signInUser={signInUser} sendEmailUser={sendEmailUser} />
        ) : step === 'forgot-password' ? (
          <ForgotPasswordForm forgotPassword={forgotPassword} />
        ) : (
          <ConfirmEmailForm verifyCode={verifyCode} />
        )}
      </div>
    </div>
  )
}