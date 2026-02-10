import z from 'zod'

export const userSignUpFormSchema = z.object({
  name: z.string('Nome obrigatório').trim(),
  email: z.email('Email inválido.').trim().min(1, 'Email obrigatório'),
  password: z.string('Senha obrigatória.').trim().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

export const userSignInFormSchema = z.object({
  email: z.email('Email inválido.').trim().min(1, 'Email obrigatório'),
  password: z.string('Senha obrigatória.').trim().min(6, 'A senha precisa ter no mínimo 6 caracteres'),
})

export const forgotPasswordFormSchema = z.object({
  email: z.email('Email inválido').trim().min(1, 'Email obrigatório'),
})