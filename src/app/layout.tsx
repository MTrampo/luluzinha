import type { Metadata, Viewport } from "next";
import { inter, lexend } from "@/commons/styles/fonts";
import "@/commons/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SubscriptionGuard } from "@/components/subscription/guard";
import { CookieConsent } from "@/components/feedbacks/cookie-consent";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { APP_URL as appUrl } from "@/commons/constants/env";

export const viewport: Viewport = {
  themeColor: "#3c0366",
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Luluzinha",
    template: "%s | Luluzinha",
  },
  description:
    "Criamos um espaço completo e fácil de usar, eliminando a papelada para você focar no que faz de melhor: deixar as unhas maravilhosas.",
  applicationName: "Luluzinha",
  authors: [{ name: "Luluzinha", url: appUrl }],
  creator: "Luluzinha Tecnologia",
  publisher: "Luluzinha",
  keywords: [
    "manicure",
    "nail designer",
    "agenda manicure",
    "app manicure",
    "agenda de unhas",
    "agenda para manicure",
    "agenda de manicures",
    "aplicativo de unhas",
    "aplicativo para manicures",
    "aplicativo de manicure e pedicure",
    "app para manicures",
    "app de manicure",
    "app de manicures",
    "gestão de atendimentos",
    "aplicativo para manicure",
    "sistema para salão de unhas",
    "controle financeiro manicure",
    "espaço digital manicure",
    "luluzinha",
    "meu trampo",
    "luluzinha app",
    "gestão de clientes",
    "gestão para manicure",
    "gestão para nail designer",
    "São Paulo",
    "Brasil",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
    },
  },
  openGraph: {
    title: "Luluzinha | Seu Espaço Digital",
    description:
      "Organize sua agenda de atendimentos, suas poderosas e seu caixa com leveza e carinho. O sistema feito para você brilhar ainda mais.",
    url: appUrl,
    siteName: "Luluzinha",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Luluzinha - Seu Espaço Digital",
      },
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Luluzinha - Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luluzinha | Seu Espaço Digital",
    description:
      "Organize sua agenda de atendimentos, suas poderosas e seu caixa com leveza e profissionalismo.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    title: "Luluzinha",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon1.png", sizes: "32x32", type: "image/png" },
      { url: "/icon0.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "geo.region": "BR-SP",
    "geo.placename": "São Paulo, Brasil",
    "geo.position": "-23.55052;-46.633308",
    ICBM: "-23.55052, -46.633308",
    "content-language": "pt-BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${lexend.variable} theme-luluzinha antialiased`}
        suppressHydrationWarning
      >

        <SubscriptionGuard />
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster richColors position="top-right" />
        <CookieConsent />
      </body>
    </html>
  );
}


