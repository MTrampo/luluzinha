import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

type HeaderProps = {
  title: ReactNode | string
}

export default function Header({ title }: HeaderProps) {
  return(
    <header className="flex border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {title}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://meu-trampo.vercel.app/"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              Meu Trampo
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}