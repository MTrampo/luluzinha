import { StandardAvatar } from "@/components/avatar"
import { cn } from "@/commons/lib/tw-merge"
import Link from "next/link"

interface TransactionProps {
  id: string
  customerName: string
  initials: string
  type: string
  amount: string
  date: string
  isEntry?: boolean
}

export function Transaction({ id, customerName, initials, type, amount, date, isEntry = true }: TransactionProps) {
  return (
    <Link 
      href={`/painel/agenda/atendimento/${id}`}
      className="flex items-center justify-between cursor-pointer transition-all p-3 sm:p-4 hover:bg-purple-50/50 group border-b border-purple-100/30 last:border-0"
    >
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <StandardAvatar size="lg" initials={initials} className="w-8 h-8 sm:w-10 sm:h-10" />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors text-sm sm:text-base truncate">
            {customerName}
          </span>
          <small className="text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate">
            {type}
          </small>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0 ml-2">
        <span className={cn(
          "font-bold text-sm sm:text-base tabular-nums",
          isEntry ? "text-green-600" : "text-red-500"
        )}>
          {isEntry ? "+" : "-"} {amount}
        </span>
        <small className="text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase">
          {date}
        </small>
      </div>
    </Link>
  )
}