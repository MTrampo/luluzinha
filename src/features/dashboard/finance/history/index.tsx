import { StandardAvatar } from "@/components/avatar"
import { cn } from "@/commons/lib/tw-merge"
import Link from "next/link"
import { FaChevronRight } from "react-icons/fa6"

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
      className="flex items-center justify-between cursor-pointer transition-all p-3.5 sm:p-4 hover:bg-purple-50/40 active:bg-purple-50/70 group"
    >
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        <StandardAvatar size="default" initials={initials} className="w-9 h-9 sm:w-10 sm:h-10 border border-purple-100/60" />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-purple-950 group-hover:text-purple-700 transition-colors text-sm sm:text-base truncate">
            {customerName}
          </span>
          <small className="text-purple-600/75 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">
            {type}
          </small>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <div className="flex flex-col items-end">
          <span className={cn(
            "font-extrabold text-sm sm:text-base tabular-nums",
            isEntry ? "text-emerald-600" : "text-red-500"
          )}>
            {isEntry ? "+" : "-"} {amount}
          </span>
          <small className="text-[10px] sm:text-[11px] font-medium text-gray-400 uppercase">
            {date}
          </small>
        </div>
        <FaChevronRight className="w-2.5 h-2.5 text-purple-200 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
      </div>
    </Link>
  )
}