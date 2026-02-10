import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa6";

export function CustomerCard() {
  return (
    <div className="flex gap-4 items-center hover:border hover:shadow p-2 rounded-md cursor-pointer transition-all">
      <Avatar size="xl">
        <AvatarFallback className="bg-purple-100 text-purple-900 border-purple-900">BM</AvatarFallback>
      </Avatar>
      <div>
        <span className="block font-medium">Beatriz Morais</span>
        <small>(11) 99999-9999</small>
      </div>
      <Button variant="ghost" className="ml-auto text-green-600 hover:text-green-700 hover:bg-transparent cursor-help">
        <FaWhatsapp/>
      </Button>
    </div>
  )
}