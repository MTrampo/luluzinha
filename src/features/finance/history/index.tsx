import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ReactNode } from "react"

export function Transaction() {
  return (
    <div className="flex items-center justify-between cursor-pointer transition-all p-4 hover:bg-gray-50 rounded-xl first:rounded-b-none not-first:rounded-none last:rounded-b-xl not-first:border-t">
      <div className="flex items-center gap-4">
        <Avatar size="xl">
          <AvatarFallback className="bg-purple-100 text-purple-900 border-purple-900">BM</AvatarFallback>
        </Avatar>
        <div>
          <span className="block font-medium">Beatriz Morais</span>
          <small className="text-muted-foreground">Transferência recebida</small>
        </div>
      </div>
      <div className="flex flex-col items-end justify-end">
        <span className="block font-semibold text-green-600">+R$ 75,00</span>
        <small className="text-xs text-muted-foreground">01 de fevereiro</small>
      </div>
    </div>
  )
}