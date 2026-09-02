import z from 'zod'

export const mpPayerEmailSchema = z.object({
  email: z.email('Informe um e-mail válido.').trim().min(1, 'E-mail obrigatório'),
})
