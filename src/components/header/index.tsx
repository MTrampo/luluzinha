
import Link from "next/link"
import Image from "next/image";
import { Navigation } from "@/components/header/nav";
import { Button } from "../ui/button";
import { FaUser, FaRightFromBracket } from "react-icons/fa6";
import { getUserLoggedApi } from "@/back/account/service/auth.api";
import { signOutAction } from "@/actions/auth";

export default async function Header() {
  const response = await getUserLoggedApi();
  const user = response?.data?.user;

  return (
    <header className="sticky top-0 z-50 bg-purple-50/80 text-purple-950 shadow-sm backdrop-blur-md border-b border-purple-100/60">
      <nav className="mx-auto p-4 max-w-5xl md:max-w-7xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="transition-transform hover:scale-105 flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Luluzinha Logo"
              width={40}
              height={40}
              priority
              className="h-auto w-10 object-contain"
            />
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-purple-700 tracking-wider uppercase font-lexend">
              Beta
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block">
              <Navigation />
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              {user ? (
                <>
                  <Button variant="ghost" className="text-purple-700 hover:bg-purple-100/50 hover:text-purple-900 transition-colors" asChild>
                    <Link href="/painel" className="text-sm font-semibold">
                      Painel
                    </Link>
                  </Button>
                  
                  <form action={async () => { "use server"; await signOutAction(); }} className="inline-flex">
                    <Button type="submit" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-semibold flex items-center gap-1.5 px-2.5 sm:px-4">
                      <FaRightFromBracket className="h-4 w-4" />
                      <span className="hidden md:inline">Sair</span>
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="text-purple-700 hover:bg-purple-100/50 hover:text-purple-900 transition-colors" asChild>
                    <Link href="/entrar" className="flex items-center gap-1.5 px-2.5 sm:px-4">
                      <FaUser className="h-4 w-4" />
                      <span className="hidden md:inline text-sm font-medium">Entrar</span>
                    </Link>
                  </Button>
                  
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md shadow-purple-100 transition-all text-xs sm:text-sm px-4 py-2 h-auto rounded-full" asChild>
                    <Link href="/cadastrar">
                      Criar minha bancada
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}