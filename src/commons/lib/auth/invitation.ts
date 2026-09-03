'use server'

import { cookies } from 'next/headers'

const INVITATION_COOKIE_KEY = 'luluzinha:auth:invitation_token'
const expiresIn = 60 * 60 * 24 * 1000 // 24 horas em ms

export async function setInvitationCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(INVITATION_COOKIE_KEY, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
      sameSite: 'lax',
    })
  } catch (error) {
    console.error('Error setting invitation cookie:', error)
  }
}

export async function getInvitationCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(INVITATION_COOKIE_KEY)?.value || null
  } catch {
    return null
  }
}

export async function clearInvitationCookie(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(INVITATION_COOKIE_KEY)
  } catch (error) {
    console.error('Error clearing invitation cookie:', error)
  }
}
