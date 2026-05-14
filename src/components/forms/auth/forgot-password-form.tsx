'use client'

import { ForgotPasswordFormInputs } from "@/commons/models/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import Image from "next/image"
import { FaEyeSlash, FaEye } from "react-icons/fa6"
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordFormSchema } from "@/commons/validations/user"

type ForgotPasswordFormProps = {
  forgotPassword: (data: ForgotPasswordFormInputs) => Promise<void>
}

export function ForgotPasswordForm({ forgotPassword }: ForgotPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  
  const formUser = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      code: '',
      password: '',
    }
  })
  
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={formUser.handleSubmit(forgotPassword)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h3>Redefinição de Senha</h3>
                <small className="text-muted-foreground text-sm text-balance">
                  Verifique seu e-mail e insira uma nova senha.
                </small>
              </div>
              <Controller
                control={formUser.control}
                name="code"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="code">Código</FieldLabel>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Código de verificação"
                      required
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={formUser.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <InputGroup>
                      <InputGroupInput 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="!S3nh4" 
                        required 
                        {...field}
                      />
                      <InputGroupAddon 
                        align="inline-end"
                        className="cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEye className="text-muted-foreground" />
                        ) : (
                          <FaEyeSlash className="text-muted-foreground" />
                        )}
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Field>
                <Button variant='theme' type="submit">ALTERAR SENHA</Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              preload
              width={1200}
              height={800}
              src='/hero-register.png' 
              alt='Capa Luluzinha' 
              className="absolute h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
