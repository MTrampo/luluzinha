import { FaClock, FaRepeat } from "react-icons/fa6";
import { BlockFormatted } from "@/commons/models/schedule";
import { BlockMenu } from "../block-menu";
import { cn } from "@/commons/lib/tw-merge";
import { BlockRecurringTypeEnum } from "@/commons/enums/schedule";
import { Card } from "@/components/ui/card";
import { getBlockIcon } from "@/components/maps/status-map";

export function ScheduleBlockCardMobile({ block }: { block: BlockFormatted }) {
  return (
    <Card className={cn(
      "relative overflow-hidden border-zinc-100 w-full bg-zinc-50/60 rounded-md",
      "border-l-4 border-zinc-400 shadow-sm gap-1"
    )}>

      {/* Topo: Horário + Duração + Recorrência */}
      <div className="flex items-center justify-between px-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-zinc-500 leading-none tracking-tight">
            {block.isAllDay ? "24h" : block.startTime}
          </span>
          <span className="text-zinc-300">·</span>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-semibold">
            <FaClock className="w-2.5 h-2.5" />
            <span>{block.durationFormatted}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {(block.recurringType === BlockRecurringTypeEnum.DAILY || block.recurringType === BlockRecurringTypeEnum.WEEKLY) && (
            <div className="flex items-center gap-1.5 bg-zinc-100 text-zinc-500 px-2 py-1 rounded-md border border-zinc-200 ml-auto">
              <FaRepeat className="text-[9px]" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {block.recurringTypeFormatted}
              </span>
            </div>
          )}
          <BlockMenu block={block} />
        </div>
      </div>

      {/* Meio: Ícone + Motivo + Horário reservado */}
      <div className="flex items-center gap-2.5 px-3 pt-2 border-t border-zinc-200/40">
        <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-zinc-400 border border-zinc-200 shadow-sm shrink-0">
          {getBlockIcon(block.reason)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm text-zinc-600 truncate">
            {block.reason}
          </span>
          {!block.isAllDay && (
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium italic mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
              Reservado: {block.startTime} às {block.endTime}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
