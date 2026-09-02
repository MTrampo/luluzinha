'use server'

import { cookies } from 'next/headers'

const KEY_ESTABLISHMENT = process.env.ESTABLISHMENT_SECRET || 'luluzinha:auth:establishment_id';
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
