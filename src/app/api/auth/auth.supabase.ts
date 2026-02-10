import { serverSupabase } from "@/commons/lib/supabase/server"
import { UserRequestBody } from "@/commons/models/user"


export const createAuthSupabase = async (user: UserRequestBody) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
  })

  return { data, error }
}

export const createProfileSupabase = async (userId: string, user: UserRequestBody) => {
  const supabase = await serverSupabase()

  const { data, error } = await supabase.from("profiles").insert({
    id: userId,
    name: user.name,
  })

  return { data, error }
}