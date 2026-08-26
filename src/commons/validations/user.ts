import z from 'zod'

export const userSignUpFormSchema = z.object({
  email: z.email('Email inválido.').trim().min(1, 'Email obrigatório'),
  password: z.string('Senha obrigatória.').trim().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

export const userSignInFormSchema = z.object({
  email: z.email('Email inválido.').trim().min(1, 'Email obrigatório'),
  password: z.string('Senha obrigatória.').trim().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

export const sendEmailFormSchema = z.object({
  email: z.email('Email inválido').trim().min(1, 'Email obrigatório'),
})

export const forgotPasswordFormSchema = z.object({
  code: z.string('Código obrigatório').regex(/^\d{6}$/, 'O código deve conter 6 dígitos'),
  password: z.string('Senha obrigatória.').trim().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

export const otpVerificationSchema = z.object({
  code: z.string('Código obrigatório').regex(/^\d{6}$/, 'O código deve conter 6 dígitos'),
})