'use server'

import { cookies } from 'next/headers'
import { ESTABLISHMENT_SECRET_KEY } from '@/commons/constants/env'
import { signSecureCookie, verifySecureCookie, getUserCookieSecret } from '@/commons/lib/crypto/secure-cookie'
import { ApiResponse } from '@/commons/lib/http/responses'

const KEY_ESTABLISHMENT = ESTABLISHMENT_SECRET_KEY
const expiresIn = 60 * 60 * 24 * 30 * 1000 // 30 dias em ms

export interface EstablishmentCookiePayload {
  establishmentId: string
  userId?: string
}

export interface AuthenticatedSessionContext {
  userId: string
  establishmentId: string
}

export type AuthenticatedSessionResult =
  | { success: true; context: AuthenticatedSessionContext }
  | { success: false; error: any }

export async function setEstablishmentCookie(idOrPayload: string | EstablishmentCookiePayload, userId?: string): Promise<void> {
  try {
    let targetUserId = typeof idOrPayload === 'string' ? userId : idOrPayload.userId
    if (!targetUserId) {
      const { getUserLoggedApi } = await import('@/back/account/service/auth.api')
      const userResult = await getUserLoggedApi()
      targetUserId = userResult?.data?.user?.id
    }

    if (!targetUserId) {
      throw new Error('[setEstablishmentCookie] Identificador do usuário ausente.')
    }

    const payload: EstablishmentCookiePayload =
      typeof idOrPayload === 'string'
        ? { establishmentId: idOrPayload, userId: targetUserId }
        : { ...idOrPayload, userId: targetUserId }

    const secret = getUserCookieSecret(targetUserId)
    const signedToken = await signSecureCookie(payload, secret)

    const cookieStore = await cookies()
    cookieStore.set(KEY_ESTABLISHMENT, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'strict',
    })
  } catch (error: any) {
    if (!error?.message?.includes('Cookies can only be modified')) {
      console.error('Error setting establishment cookie:', error)
    }
  }
}

export async function clearEstablishmentCookie(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(KEY_ESTABLISHMENT)
  } catch (error: any) {
    if (!error?.message?.includes('Cookies can only be modified')) {
      console.error('Error clearing establishment cookie:', error)
    }
  }
}

/**
 * Obtém o contexto de sessão autenticado (userId e establishmentId válido).
 * Se a sessão for inválida, inexistente ou adulterada:
 * - Executa a limpeza completa de sessão (signOutApi)
 * - Retorna o erro ApiResponse.Unauthorized padronizado para as Server Actions.
 */
export async function getAuthenticatedSessionContext(): Promise<AuthenticatedSessionResult> {
  try {
    const { getUserLoggedApi, signOutApi } = await import('@/back/account/service/auth.api')
    const userResult = await getUserLoggedApi()
    const userId = userResult?.data?.user?.id

    if (!userId) {
      await signOutApi()
      return {
        success: false,
        error: ApiResponse.Unauthorized({
          message: 'Sua sessão expirou por segurança. Por favor, faça login novamente para acessar o seu espaço.',
        }),
      }
    }

    // 1. Tentar ler cookie assinado e verificado com a chave dinâmica do usuário
    const cookieStore = await cookies()
    const rawToken = cookieStore.get(KEY_ESTABLISHMENT)?.value
    let validEstablishmentId: string | null = null

    if (rawToken) {
      try {
        const secret = getUserCookieSecret(userId)
        const verified = await verifySecureCookie<EstablishmentCookiePayload | string>(rawToken, secret)
        if (verified) {
          if (typeof verified === 'string') {
            validEstablishmentId = verified
          } else if (verified.establishmentId && (!verified.userId || verified.userId === userId)) {
            validEstablishmentId = verified.establishmentId
          }
        }
      } catch {
        validEstablishmentId = null
      }
    }

    // 2. Se não houver cookie válido, busca no Supabase pelo dono logado
    if (!validEstablishmentId) {
      const { getEstablishmentsByOwnerIdSupabase } = await import('@/back/account/repository/establishment.supabase')
      const { data: establishments } = await getEstablishmentsByOwnerIdSupabase(userId)

      if (establishments && establishments.length > 0) {
        validEstablishmentId = establishments[0].id
        await setEstablishmentCookie(validEstablishmentId, userId)
      }
    }

    // 3. Se ainda não houver estabelecimento associado à conta, força encerramento
    if (!validEstablishmentId) {
      await signOutApi()
      return {
        success: false,
        error: ApiResponse.Unauthorized({
          message: 'Sua sessão expirou por segurança. Por favor, faça login novamente para acessar o seu espaço.',
        }),
      }
    }

    return {
      success: true,
      context: {
        userId,
        establishmentId: validEstablishmentId,
      },
    }
  } catch (error) {
    console.error('[getAuthenticatedSessionContext] Falha crítica de sessão:', error)
    const { signOutApi } = await import('@/back/account/service/auth.api')
    await signOutApi()
    return {
      success: false,
      error: ApiResponse.Unauthorized({
        message: 'Sua sessão expirou por segurança. Por favor, faça login novamente para acessar o seu espaço.',
      }),
    }
  }
}

/**
 * @deprecated Use getAuthenticatedSessionContext()
 */
export async function getEstablishmentCookie(): Promise<string | null> {
  const result = await getAuthenticatedSessionContext()
  return result.success ? result.context.establishmentId : null
}

/**
 * @deprecated Use getAuthenticatedSessionContext()
 */
export async function getOrResolveEstablishmentId(): Promise<string | null> {
  const result = await getAuthenticatedSessionContext()
  return result.success ? result.context.establishmentId : null
}


