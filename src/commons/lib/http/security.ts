import { NextResponse, type NextRequest } from 'next/server'
import { MercadoPagoStatusEnum } from '@/commons/enums/subscription'
import type { SubscriptionPayloadCookie } from '@/commons/models/subscription'
import { SUB_SECRET_KEY } from '@/commons/constants/env'

const publicApiRoutes = ['/api/webhooks']
const publicPaths = ['/', '/entrar', '/cadastrar', '/assinatura', '/documento/termo', '/documento/politica']
const authPaths = ['/entrar', '/cadastrar']

const GRACE_PERIOD_MS = 3 * 24 * 60 * 60 * 1000 // 3 dias em ms

export function handleRouteAccess(request: NextRequest, user: unknown, supabaseResponse: NextResponse) {
  const pathname = request.nextUrl.pathname

  const isPublicApiRoute = publicApiRoutes.some(path => pathname.startsWith(path))
  const isPublicPath = publicPaths.some(path => pathname === path) || pathname.startsWith('/convite')


  // API não autenticada → 401
  if (!user && pathname.startsWith('/api/') && !isPublicApiRoute) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 })
  }

  // Não autenticado em rota privada → /entrar
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/entrar'
    return NextResponse.redirect(url)
  }

  // Autenticado tentando acessar páginas de auth → /painel
  if (user && authPaths.includes(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/painel'
    return NextResponse.redirect(url)
  }

  // Autenticado acessando /painel/** → verificar assinatura
  if (user && pathname.startsWith('/painel')) {
    const cookieName = SUB_SECRET_KEY
    const cookieValue = request.cookies.get(cookieName)?.value

    try {
      const subscription: SubscriptionPayloadCookie = cookieValue ? JSON.parse(cookieValue) : null
      if (!subscription || !isSubscriptionActive(subscription)) {
        const url = request.nextUrl.clone()
        url.pathname = '/assinatura'
        return NextResponse.redirect(url)
      }
    } catch {
      const url = request.nextUrl.clone()
      url.pathname = '/assinatura'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export function isSubscriptionActive(subscription: SubscriptionPayloadCookie): boolean {
  const status = subscription.status as MercadoPagoStatusEnum

  if (
    status === MercadoPagoStatusEnum.Cancelled ||
    status === MercadoPagoStatusEnum.Paused ||
    status === MercadoPagoStatusEnum.Rejected
  ) {
    return false
  }

  if (status === MercadoPagoStatusEnum.Authorized) {
    if (!subscription.currentPeriodEnd) return true

    const endDate = new Date(subscription.currentPeriodEnd).getTime()
    return endDate + GRACE_PERIOD_MS > Date.now()
  }

  return false
}