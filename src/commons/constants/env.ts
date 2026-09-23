export function getRequiredEnv(key: string): string {
  if (typeof window !== 'undefined') {
    return ''
  }
  const value = process.env[key]
  if (!value) {
    throw new Error(`[ENV_ERROR] Variável de ambiente obrigatória não configurada: ${key}`)
  }
  return value
}

function getRequiredServerEnv(key: string, value: string | undefined): string {
  if (typeof window !== 'undefined') {
    // No cliente/navegador, segredos de servidor não são expostos
    return ''
  }
  if (!value) {
    throw new Error(`[ENV_ERROR] Variável de ambiente obrigatória não configurada: ${key}`)
  }
  return value
}

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'https://luluzinha.meutrampo.dev.br'
export const APP_URL = rawAppUrl.startsWith('http://') || rawAppUrl.startsWith('https://') ? rawAppUrl : `https://${rawAppUrl}`

// Variáveis públicas com acesso literal explícito para static inlining do Next.js
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Variáveis de servidor com acesso literal e validação apenas no backend
export const SUPABASE_SERVICE_ROLE_KEY = getRequiredServerEnv('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY)
export const SUB_SECRET_KEY = getRequiredServerEnv('SUB_SECRET', process.env.SUB_SECRET)
export const ESTABLISHMENT_SECRET_KEY = getRequiredServerEnv('ESTABLISHMENT_SECRET', process.env.ESTABLISHMENT_SECRET)
export const COOKIE_SIGNING_SECRET = getRequiredServerEnv('COOKIE_SIGNING_SECRET', process.env.COOKIE_SIGNING_SECRET)


