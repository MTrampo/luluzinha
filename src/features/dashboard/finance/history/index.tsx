import { StandardAvatar } from "@/components/avatar"
import { cn } from "@/commons/lib/tw-merge"

interface TransactionProps {
  customerName: string
  initials: string
  type: string
  amount: string
  date: string
  isEntry?: boolean
}

export function Transaction({ customerName, initials, type, amount, date, isEntry = true }: TransactionProps) {
  return (
    <div className="flex items-center justify-between cursor-pointer transition-all p-4 hover:bg-purple-50/50 group border-b border-purple-100/30 last:border-0">
      <div className="flex items-center gap-4">
        <StandardAvatar size="lg" initials={initials} />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
            {customerName}
          </span>
          <small className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
            {type}
          </small>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={cn(
          "font-bold text-base tabular-nums",
          isEntry ? "text-green-600" : "text-red-500"
        )}>
          {isEntry ? "+" : "-"} {amount}
        </span>
        <small className="text-[10px] font-semibold text-gray-400 uppercase">
          {date}
        </small>
      </div>
    </div>
  )
}