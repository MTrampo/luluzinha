import type { Metadata } from "next";
import { inter, lexend } from "@/commons/styles/fonts";
import "@/commons/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SubscriptionGuard } from "@/components/subscription/guard";


export const metadata: Metadata = {
  title: "Luluzinha | Sua Bancada Digital",
  description: "Preparamos cada detalhe com muito carinho para que seu dia a dia como manicure seja mais leve, organizado e profissional. Comece sua bancada digital gratuitamente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lexend.variable} antialiased`}
        suppressHydrationWarning
      >
        <SubscriptionGuard />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
