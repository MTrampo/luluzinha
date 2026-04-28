import { type NextRequest } from "next/server"
import { updateSession } from "@/commons/lib/supabase/session"
import { handleRouteAccess } from "./commons/lib/http/security"

export async function proxy(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request)
  return handleRouteAccess(request, user, supabaseResponse)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}