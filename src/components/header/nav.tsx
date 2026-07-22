import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function Navigation() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-1 sm:gap-2">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/#funcionalidades" className="text-sm font-medium text-purple-800 hover:text-purple-600 transition-colors">
              Funcionalidades
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/#preco" className="text-sm font-medium text-purple-800 hover:text-purple-600 transition-colors">
              Preço
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/#duvidas" className="text-sm font-medium text-purple-800 hover:text-purple-600 transition-colors">
              Dúvidas
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}