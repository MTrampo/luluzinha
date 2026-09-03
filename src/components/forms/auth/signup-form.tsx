'use client'

import { UserSignUpFormInputs } from "@/commons/models/user"
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
import { userSignUpFormSchema } from "@/commons/validations/user"

type SignupFormProps = {
  signUpUser: (data: UserSignUpFormInputs) => Promise<void>
}

export function SignupForm({ signUpUser }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const formUser = useForm<UserSignUpFormInputs>({
    resolver: zodResolver(userSignUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <Card className="overflow-hidden p-0 rounded-2xl sm:rounded-3xl border border-purple-100 shadow-xl shadow-purple-950/5 bg-white">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-5 sm:p-8 flex flex-col justify-center" method="POST" onSubmit={formUser.handleSubmit(signUpUser)}>

            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h3>Crie sua conta</h3>
                <small className="text-muted-foreground text-sm text-balance">
                  Entre com seu melhor e-mail para criar sua conta
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
                <Button variant='theme' type="submit">CRIAR CONTA</Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                OU
              </FieldSeparator>
              <FieldDescription className="text-center">
                Já tem uma conta? <Link href="/entrar">Entre clicando aqui</Link>
              </FieldDescription>
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
      <FieldDescription className="px-6 text-center">
        Ao clicar em criar conta, você concorda com nossos <Link href="/documento/termo">Termos de Serviço</Link>{" "}
        e <Link href="/documento/politica">Política de Privacidade</Link>.
      </FieldDescription>
    </div>
  )
}
