
import Link from "next/link"
import Image from "next/image";
import { Navigation } from "@/components/header/nav";
import { Button } from "../ui/button";
import { FaUser } from "react-icons/fa6";

export default function Header() {

  return (
    <header className="bg-purple-300 text-white shadow-sm">
      <nav className="mx-auto p-4 max-w-5xl md:max-w-7xl">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Luluzinha Logo"
              width={40}
              height={40}
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Navigation />
            <Button variant='ghost' asChild>
              <Link href="/entrar">
                <FaUser/>
              </Link>
            </Button>
            {/* <ModeToggle /> */}
          </div>
        </div>
      </nav>
    </header>
  )
}