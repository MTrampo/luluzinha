import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

type HeaderProps = {
  title: ReactNode | string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1.5 px-3.5 sm:px-6">
        <SidebarTrigger className="-ml-1 h-9 w-9 text-purple-700 hover:text-purple-900 hover:bg-purple-100/60 rounded-md transition-colors" />
        <Separator
          orientation="vertical"
          className="mx-1 sm:mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-bold text-purple-900 truncate">
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