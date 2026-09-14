import { SignInFlow } from "@/features/signin";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Entrar no Seu Espaço",
  description:
    "Acesse seu espaço digital na Luluzinha para gerenciar sua agenda de atendimentos, suas poderosas clientes e seu caixa.",
  alternates: {
    canonical: "/entrar",
  },
};

export default function SingnIn() {
  return (
    <div className="bg-muted/60 min-h-svh flex flex-col items-center justify-center px-3.5 sm:px-6 py-6 sm:py-12">
      <div className="w-full max-w-lg md:max-w-4xl">
        <SignInFlow/>
      </div>
    </div>
  );
}