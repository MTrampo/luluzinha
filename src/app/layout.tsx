import type { Metadata, Viewport } from "next";
import { inter, lexend } from "@/commons/styles/fonts";
import "@/commons/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SubscriptionGuard } from "@/components/subscription/guard";
import { CookieConsent } from "@/components/feedbacks/cookie-consent";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { APP_URL as appUrl } from "@/commons/constants/env";

export const viewport: Viewport = {
  themeColor: "#3c0366",
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Luluzinha | Sistema para Manicures, Nail Designers e Podólogas",
    template: "%s | Luluzinha",
  },
  description:
    "O espaço digital completo para Manicures, Pedicures, Nail Designers e Podólogas. Organize sua agenda de atendimentos, suas Poderosas e seu caixa com leveza.",
  applicationName: "Luluzinha",
  authors: [{ name: "Meu Trampo", url: "https://meutrampo.dev.br" }],
  creator: "Meu Trampo",
  publisher: "Meu Trampo",
  keywords: [
    "manicure",
    "pedicure",
    "nail designer",
    "designer de unhas",
    "podologia",
    "podóloga",
    "podólogo",
    "agenda manicure",
    "agenda nail designer",
    "agenda podologia",
    "agenda para manicure",
    "agenda de unhas",
    "app manicure",
    "app para manicure",
    "app para nail designer",
    "app podologia",
    "aplicativo de manicure e pedicure",
    "aplicativo para manicure",
    "aplicativo para nail designer",
    "aplicativo designer de unhas",
    "sistema para manicure",
    "sistema para nail designer",
    "sistema para salão de unhas",
    "sistema para podologia",
    "gestão de atendimentos",
    "gestão para manicure",
    "gestão para nail designer",
    "gestão para podóloga",
    "controle financeiro manicure",
    "controle de caixa manicure",
    "ficha de clientes manicure",
    "espaço digital manicure",
    "luluzinha",
    "meu trampo",
    "luluzinha app",
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
    title: "Luluzinha | Sistema para Manicures, Nail Designers e Podólogas",
    description:
      "Organize sua agenda de atendimentos, suas poderosas e seu caixa com leveza e carinho. O sistema perfeito para Manicures, Pedicures, Nail Designers e Podólogas brilharem ainda mais.",
    url: appUrl,
    siteName: "Luluzinha",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Luluzinha - O Espaço Digital para Manicures, Nail Designers e Podólogas",
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
    title: "Luluzinha | Sistema para Manicures, Nail Designers e Podólogas",
    description:
      "Organize sua agenda de atendimentos, suas poderosas e seu caixa com leveza e profissionalismo. Feito para Manicures, Pedicures, Nail Designers e Podólogas.",
    images: ["/opengraph-image.png"],
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
        <GoogleAnalytics gaId="G-5VBC887RXJ" />
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


