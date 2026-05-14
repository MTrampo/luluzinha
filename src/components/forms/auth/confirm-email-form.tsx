'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Field, FieldSeparator, FieldError } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { otpVerificationSchema } from "@/commons/validations/user"
import { useCallback } from "react"
import { FaEnvelope, FaEnvelopeCircleCheck } from "react-icons/fa6"
import { OtpFormInputs } from "@/commons/models/user"

type OtpFormProps = {
  verifyCode: (data: OtpFormInputs) => void
}

export function ConfirmEmailForm({ verifyCode }: OtpFormProps) {
  const formOtp = useForm<OtpFormInputs>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      code: "",
    },
  })

  const handleCodeChange = useCallback((value: string) => {
    formOtp.setValue("code", value)
    
    if (value.length === 8) {
      formOtp.handleSubmit(verifyCode)()
    }
  }, [formOtp, verifyCode])

  return (
    <form onSubmit={formOtp.handleSubmit(verifyCode)}>
      <Card className="mx-auto max-w-md">
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h3>Confirmar E-mail</h3>
            <small className="text-muted-foreground text-sm text-balance">
              Digite o código de verificação de 6 dígitos que enviamos para o seu endereço de e-mail.
            </small>
          </div>
          <Controller
            control={formOtp.control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <InputOTP
                  containerClassName="justify-center"
                  maxLength={8}
                  id="otp-verification"
                  required
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.value}
                  onChange={handleCodeChange}
                >
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator className="mx-2" />
                  <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Field>
            <Button variant="theme" type="submit" className="w-full">
              <FaEnvelopeCircleCheck />
              CONFIRMAR
            </Button>
          </Field>
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card mb-8">
            OU
          </FieldSeparator>
          <Field>
            <Button variant="outline" type="button">
              <FaEnvelope />
              REENVIAR CÓDIGO
            </Button>
          </Field>
        </CardContent>
      </Card>
    </form>
  )
}
