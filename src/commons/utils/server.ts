import { headers } from "next/headers";

/**
 * Verifica no lado do servidor se a requisição provém de um dispositivo móvel,
 * analisando o cabeçalho User-Agent.
 */
export async function checkIsMobileServer(): Promise<boolean> {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  return /mobile|android|iphone|ipad|phone/i.test(userAgent);
}
