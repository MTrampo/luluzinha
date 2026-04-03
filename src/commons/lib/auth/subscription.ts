'use server'

import { cookies } from 'next/headers'

const KEY_SUB = process.env.SUB_SECRET || '';
const KEY_TEAM = process.env.COOKIE_TEAM || '';
const expiresIn = 60 * 60 * 24 * 3 * 1000; // 3 dias em ms
//const COOKIE_NAME = '__Secure-mtoaiusrcrtkn'

export async function setToken(token: string): Promise<void> {
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

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(KEY_SUB)?.value
  return cookieValue || null
}

export async function clearToken(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(KEY_SUB)
  } catch (error) {
    console.log(error)
  }
}

// export async function clearAuthenticatedUserSession(uid?: string): Promise<void> {
//   const cookieStore = await cookies();
//   cookieStore.delete(COOKIE_TK);
//   cookieStore.delete(COOKIE_TEAM);

//   if (uid) {
//     await firebaseAdmin.auth.revokeRefreshTokens(uid);
//   }
// }

// export async function clearToken(): Promise<void> {
//   const cookieStore = await cookies()
//   cookieStore.delete(COOKIE_TK)
// }

// export async function hasToken(): Promise<boolean> {
//   const cookieStore = await cookies()
//   return !!cookieStore.get(COOKIE_TK)?.value
// }

// export async function createAuthenticatedUserSession(token: string) {
//   try {
//     const session = await firebaseAdmin.auth.createSessionCookie(token, { expiresIn });
//     await setToken(session)
//     return true
//   } catch (error) {
//     console.log('Erro ao criar sessão: ', error);
//     return false;
//   }
// }

// export async function verifyAndSetAuthenticatedUserToken(token: string) {
//   try {
//     await firebaseAdmin.auth.verifyIdToken(token)
//     await setToken(token)

//     return true
//   } catch (error) {
//     console.error('Erro ao verificar e setar o token:', error)
//     return false
//   }
// }

// export async function getAuthenticatedUserSession(): Promise<UserSession> {
//   try {
//     const token = await getToken();
//     if (!token) {
//       return {
//         code: AuthenticationCodeEnum.ID_TOKEN_NOT_FOUND,
//         decodedToken: null,
//         selectedTeamId: null,
//       };
//     }

//     const decodedToken = await firebaseAdmin.auth.verifySessionCookie(token, true);
//     return {
//       code: AuthenticationCodeEnum.DEFAULT,
//       decodedToken,
//       selectedTeamId: null,
//     };
//   } catch (error) {
//     const errorCode = (error as { code?: keyof typeof AuthenticationCodeEnum }).code;
//     const code = (errorCode && errorCode in AuthenticationCodeEnum) ? AuthenticationCodeEnum[errorCode] : AuthenticationCodeEnum.DEFAULT;
//     console.log('Falha ao verificar sessão e obter token:', error);
//     return {
//       code,
//       decodedToken: null,
//       selectedTeamId: null,
//     };
//   }
// }

// export async function getAuthenticatedUser(): Promise<UserSession> {
//   try {
//     const token = await getToken();
//     if (!token) {
//       return {
//         code: AuthenticationCodeEnum.ID_TOKEN_NOT_FOUND,
//         decodedToken: null,
//         selectedTeamId: null,
//       };
//     }

//     const decodedToken = await firebaseAdmin.auth.verifyIdToken(token);
//     return {
//       code: AuthenticationCodeEnum.DEFAULT,
//       decodedToken,
//       selectedTeamId: null,
//     };
//   } catch (error) {
//     const errorCode = (error as { code?: keyof typeof AuthenticationCodeEnum }).code;
//     const code = (errorCode && errorCode in AuthenticationCodeEnum) ? AuthenticationCodeEnum[errorCode] : AuthenticationCodeEnum.DEFAULT;
//     console.log('Falha ao verificar token:', error);
//     return {
//       code,
//       decodedToken: null,
//       selectedTeamId: null,
//     };
//   }
// }

// export async function setTeamCookie(team: string): Promise<void> {
//   try {
//     const cookieStore = await cookies()
//     cookieStore.set(COOKIE_TEAM, team, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60 * 24 * 60, // 60 dias
//       path: '/',
//       sameSite: 'strict',
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

// export async function getTeamCookie(): Promise<string | null> {
//   const cookieStore = await cookies()
//   const cookieValue = cookieStore.get(COOKIE_TEAM)?.value
//   return cookieValue || null
// }

// export async function clearTeamCookie(): Promise<void> {
//   const cookieStore = await cookies()
//   cookieStore.delete(COOKIE_TEAM)
// }

// export async function hasTeamCookie(): Promise<boolean> {
//   const cookieStore = await cookies()
//   return !!cookieStore.get(COOKIE_TEAM)?.value
// }

// export async function checkIfHaveTeamSelectedAndIfNotSelectOne(team: string) {
//   try {
//     const teamId = await getTeamCookie()
//     if (!teamId) {
//       await setTeamCookie(team)
//       return team
//     }

//     return teamId;
//   } catch (error) {
//     console.error('Erro ao verificar ou selecionar time:', error)
//     return null
//   }
// }

// export async function withAuth(handler: (session: UserSession) => Promise<Response>) {
//   try {
//     const token = await getToken();
//     if (!token) throw new Unauthorized()

//     const selectedTeamId = await getTeamCookie();
//     const decodedToken = await firebaseAdmin.auth.verifySessionCookie(token, true);
    
//     const result: UserSession = {
//       code: AuthenticationCodeEnum.DEFAULT,
//       decodedToken,
//       selectedTeamId,
//     };

//     return handler(result);
//   } catch (error: unknown) {
//     console.error('Auth error:', error);

//     if (error instanceof ApiCodeError) {
//       return Response.json(error.toJSON(), { status: error.status })
//     }

//     const internalError = new InternalServerError()
//     return Response.json(internalError.toJSON(), { status: internalError.status })
//   }
// }