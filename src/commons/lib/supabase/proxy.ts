import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicApiRoutes = ['/api/auth']
const publicPaths = ['/', '/entrar', '/cadastrar', '/assinatura', '/documento/termo', '/documento/politica']
const authPaths = ['/entrar', '/cadastrar']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const pathname = request.nextUrl.pathname
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Validação da sessão
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const isPublicApiRoutes = publicApiRoutes.some(path => pathname === path)
  const isPublicPath = publicPaths.some(path => pathname === path)

  // Se for uma rota de API e não estiver logado, retornar 401 em vez de redirecionar
  if (!user && pathname.startsWith('/api/') && !isPublicApiRoutes) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  // Se não tem usuário e a rota não é pública -> Redireciona para /entrar
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/entrar' // Ajustado para bater com seu publicPaths

    return NextResponse.redirect(url)
  }

  // Se tem usuário e ele tenta ir para /entrar ou /cadastrar -> Manda para a Agenda (Fluxo)
  if (user && authPaths.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/painel'
    
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}