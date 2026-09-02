"use client"

import { MouseEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function Navigation() {
  const pathname = usePathname()

  const handleScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      const element = document.getElementById(targetId)
      if (element) {
        e.preventDefault()
        element.scrollIntoView({ behavior: "smooth", block: "start" })
        window.history.pushState(null, "", `#${targetId}`)
      }
    }
  }

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-1 sm:gap-2">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/#funcionalidades"
              onClick={(e) => handleScroll(e, "funcionalidades")}
              className="text-sm font-medium text-purple-800 hover:text-purple-600 transition-colors"
            >
              Funcionalidades
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/#preco"
              onClick={(e) => handleScroll(e, "preco")}
              className="text-sm font-medium text-purple-800 hover:text-purple-600 transition-colors"
            >
              Preço
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/#duvidas"
              onClick={(e) => handleScroll(e, "duvidas")}
              className="text-sm font-medium text-purple-800 hover:text-purple-600 transition-colors"
            >
              Dúvidas
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}