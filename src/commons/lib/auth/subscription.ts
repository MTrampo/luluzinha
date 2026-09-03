'use server'

import { cookies } from 'next/headers'
import { SUB_SECRET_KEY } from '@/commons/constants/env'

const KEY_SUB = SUB_SECRET_KEY;
const expiresIn = 60 * 60 * 24 * 30 * 1000; // 30 dias em ms

export async function setCookieSubscription(token: string): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(KEY_SUB, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000, // segundos
      path: '/',
      sameSite: 'strict',
    })
  } catch (error) {
    console.log(error)
  }
}

export async function getCookieSubscription(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(KEY_SUB)?.value
  return cookieValue || null
}

export async function clearCookieSubscription(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(KEY_SUB)
  } catch (error) {
    console.log(error)
  }
}