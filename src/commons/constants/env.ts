export function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`[ENV_ERROR] Variável de ambiente obrigatória não configurada: ${key}`)
  }
  return value
}

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'https://luluzinha.meutrampo.dev.br'
export const APP_URL = rawAppUrl.startsWith('http://') || rawAppUrl.startsWith('https://') ? rawAppUrl : `https://${rawAppUrl}`

export const SUPABASE_URL = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')
export const SUPABASE_ANON_KEY = getRequiredEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
export const SUPABASE_SERVICE_ROLE_KEY = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY')

export const SUB_SECRET_KEY = getRequiredEnv('SUB_SECRET')
export const ESTABLISHMENT_SECRET_KEY = getRequiredEnv('ESTABLISHMENT_SECRET')
export const COOKIE_SIGNING_SECRET = getRequiredEnv('COOKIE_SIGNING_SECRET')

