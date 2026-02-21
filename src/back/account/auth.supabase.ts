import { serverSupabase } from "@/commons/lib/supabase/server"
import { ResetPasswordRequestBody, UserRequestBody } from "@/commons/models/user"

export const signInWithEmail = async(email: string, password: string) => {
  const supabase = await serverSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  return { data, error }
}

export const createAuthSupabase = async (user: UserRequestBody) => {
  const supabase = await serverSupabase()
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        display_name: user.name,
      }
    }
  })

  return { data, error }
}

export const killAuthSupabase = async () => {
  const supabase = await serverSupabase()
  const { error } = await supabase.auth.signOut()

  return error
}

export const createProfileSupabase = async (userId: string, user: UserRequestBody) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase.from("profiles").insert({
    id: userId,
    name: user.name,
  })

  return { data, error }
}

export const verifyCode = async (email:string, token: string) => {
  const supabase = await serverSupabase()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email"
  })

  return { data, error }
}

export const resendOtpCode = async (email: string) => {
  const supabase = await serverSupabase()
  
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
    options: {
      // Garante que o usuário permaneça no fluxo de OTP
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` 
    }
  })

  return error
}

export const sendPasswordResetEmail = async (email: string) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase.auth.resetPasswordForEmail(email)

  return { data, error}
}

export const confirmCodePasswordReset = async (email: string, token: string) => {
  const supabase = await serverSupabase()
  
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery'
  })

  return { data, error }
}

export const updatePassword = async (newPassword: string) => {
  const supabase = await serverSupabase()
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  
  return { data, error }
}