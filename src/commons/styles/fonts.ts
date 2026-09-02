import { Inter, Lexend } from "next/font/google";

export const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  fallback: ["sans-serif"],
  weight: ["500", "700", "800", "900"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  fallback: ["sans-serif"],
  weight: ["300", "400", "500"],
});