'use server'

import { cookies } from 'next/headers'
import { ESTABLISHMENT_SECRET_KEY } from '@/commons/constants/env'

const KEY_ESTABLISHMENT = ESTABLISHMENT_SECRET_KEY;
const expiresIn = 60 * 60 * 24 * 30 * 1000; // 30 dias em ms

export async function setEstablishmentCookie(id: string): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(KEY_ESTABLISHMENT, id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'strict',
    })
  } catch (error) {
    console.error('Error setting establishment cookie:', error)
  }
}

export async function getEstablishmentCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(KEY_ESTABLISHMENT)?.value
  return cookieValue || null
}

export async function clearEstablishmentCookie(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(KEY_ESTABLISHMENT)
  } catch (error) {
    console.error('Error clearing establishment cookie:', error)
  }
}

export async function getOrResolveEstablishmentId(): Promise<string | null> {
  const cookieId = await getEstablishmentCookie()
  if (cookieId) return cookieId

  try {
    const { getUserLoggedApi } = await import('@/back/account/service/auth.api')
    const userResult = await getUserLoggedApi()
    const userId = userResult?.data?.user?.id

    if (!userId) return null

    const { getEstablishmentsByOwnerIdSupabase } = await import('@/back/account/repository/establishment.supabase')
    const { data: establishments } = await getEstablishmentsByOwnerIdSupabase(userId)


    if (establishments && establishments.length > 0) {
      const activeId = establishments[0].id
      await setEstablishmentCookie(activeId)
      return activeId
    }
  } catch (error) {
    console.error('Error resolving establishment ID:', error)
  }

  return null
}

