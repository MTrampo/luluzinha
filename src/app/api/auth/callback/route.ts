import { ApiResponse } from "@/commons/lib/http/responses"
import { serverSupabase } from "@/commons/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await serverSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      // const res = ApiResponse.Unauthorized({
      //   message: "Erro ao confirmar e-mail do usuário.",
      //   error: error.message
      // });

      console.error("Erro ao confirmar e-mail do usuário:", error);
      return Response.redirect(`${origin}/entrar`)
    }
    return Response.redirect(`${origin}/painel`)
  }
  return Response.redirect(`${origin}/entrar`)
}