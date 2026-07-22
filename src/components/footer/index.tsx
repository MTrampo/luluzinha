import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800 w-full">
      <div className="mx-auto max-w-5xl md:max-w-7xl px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-neutral-800 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Luluzinha Logo"
              width={36}
              height={36}
              className="brightness-0 invert opacity-80"
            />
            <span className="text-white font-extrabold text-lg tracking-wide font-lexend">Luluzinha</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</Link>
            <Link href="/#preco" className="hover:text-white transition-colors">Preço</Link>
            <Link href="/#duvidas" className="hover:text-white transition-colors">Dúvidas</Link>
            <Link href="/documento/politica" className="hover:text-white transition-colors">Política de Privacidade</Link>
            <Link href="/documento/termo" className="hover:text-white transition-colors">Termos de Serviço</Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Luluzinha. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="h-3 w-3 text-red-500 fill-red-500" /> para valorizar o trabalho das manicures.
          </p>
        </div>
      </div>
    </footer>
  );
}
