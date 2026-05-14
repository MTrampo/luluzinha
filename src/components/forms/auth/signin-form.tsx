'use client'

import { UserSignInFormInputs, SendEmailFormInputs } from "@/commons/models/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import Image from "next/image"
import Link from "next/link"
import { FaEyeSlash, FaEye } from "react-icons/fa6"
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod'
import { userSignInFormSchema, sendEmailFormSchema } from "@/commons/validations/user"

type SignInFormProps = {
  signInUser: (data: UserSignInFormInputs) => Promise<void>
  sendEmailUser: (data: SendEmailFormInputs) => Promise<void>
}

export function SignInForm({ signInUser, sendEmailUser }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  
  const currentSchema = isForgotPassword ? sendEmailFormSchema : userSignInFormSchema
  const formUser = useForm<UserSignInFormInputs | SendEmailFormInputs>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true)
    formUser.reset({ email: formUser.getValues('email') })
  }

  const handleBackToSignIn = () => {
    setIsForgotPassword(false)
    formUser.reset({ email: formUser.getValues('email'), password: '' })
  }

  const handleSubmit = (data: UserSignInFormInputs | SendEmailFormInputs) => {
    if (isForgotPassword) {
      sendEmailUser(data as SendEmailFormInputs)
    } else {
      signInUser(data as UserSignInFormInputs)
    }
  }
  
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={formUser.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h3>{isForgotPassword ? 'Recuperar senha' : 'Entre na sua conta'}</h3>
                <small className="text-muted-foreground text-sm text-balance">
                  {isForgotPassword 
                    ? 'Digite seu e-mail para recuperação de senha'
                    : 'Acesse o seu espaço usando o e-mail e senha cadastrados'
                  }
                </small>
              </div>
              <Controller
                control={formUser.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="luluzinha@example.com"
                      required
                      {...field}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {!isForgotPassword && (
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
              )}
              <Field>
                <Button variant='theme' type="submit">{isForgotPassword ? 'ENVIAR' : 'ENTRAR'}</Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                OU
              </FieldSeparator>
              <Field>
                <FieldDescription className="text-center">
                  {isForgotPassword ? (
                    <>Lembrou sua senha? <Link href="#" onClick={handleBackToSignIn}>Clique aqui</Link></>
                  ) : (
                    <>Não possui conta? <Link href="/cadastrar">Cadastre-se clicando aqui</Link></>
                  )}
                </FieldDescription>
                {!isForgotPassword && (
                  <FieldDescription className="text-center">
                    Esqueceu a senha? <Link href="#" onClick={handleForgotPasswordClick}>Clique aqui</Link>
                  </FieldDescription>
                )}
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
