import type { Metadata } from "next";
import { inter, lexend } from "@/commons/styles/fonts";
import "@/commons/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SubscriptionGuard } from "@/components/subscription/guard";
import { CookieConsent } from "@/components/feedbacks/cookie-consent";

export const metadata: Metadata = {
  title: "Luluzinha | Seu Espaço Digital",
  description: "Preparamos cada detalhe com muito carinho para que seu dia a dia como manicure seja mais leve, organizado e profissional. Comece seu espaço digital gratuitamente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lexend.variable} theme-luluzinha antialiased`}
        suppressHydrationWarning
      >
        <SubscriptionGuard />
        {children}
        <Toaster richColors position="top-right" />
        <CookieConsent />
      </body>
    </html>
  );
}
