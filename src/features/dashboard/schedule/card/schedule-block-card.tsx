import { FaClock, FaRepeat } from "react-icons/fa6";
import { BlockFormatted } from "@/commons/models/schedule";
import { BlockMenu } from "./block-menu";
import { cn } from "@/commons/lib/tw-merge";
import { BlockRecurringTypeEnum } from "@/commons/enums/schedule";
import { Card } from "@/components/ui/card";
import { getBlockIcon } from "@/components/maps/status-map";

export function ScheduleBlockCard({ block }: { block: BlockFormatted }) {
  return (
    <Card className={cn(
      "relative flex flex-row items-center gap-0 p-0 overflow-hidden border-zinc-100 min-h-24 w-full bg-zinc-50/60 rounded-md",
      "border-l-4 border-zinc-400 shadow-sm"
    )}>

      {/* Coluna do Horário (Esquerda) - Tom neutro sólido */}
      <div className="flex flex-col items-center justify-center py-3 w-24 md:w-32 border-r border-dashed border-zinc-200 shrink-0">
        <span className="text-base md:text-xl font-black text-zinc-500 leading-none">
          {block.isAllDay ? "24h" : block.startTime}
        </span>
        <div className="flex items-center gap-1 mt-1.5 text-zinc-400">
          <FaClock className="w-2 h-2 md:w-3 md:h-3" />
          <span className="text-[10px] md:text-xs font-medium">
            {block.durationFormatted}
          </span>
        </div>
      </div>

      {/* Coluna Central (Info) */}
      <div className="flex-1 flex flex-row items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-8 w-8 md:h-11 md:w-11 rounded-full bg-white flex items-center justify-center text-zinc-400 border border-zinc-200 shadow-sm">
            {getBlockIcon(block.reason)}
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-xs md:text-base text-zinc-600 truncate max-w-[150px] md:max-w-none">
              {block.reason}
            </span>
            {!block.isAllDay && (
              <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-zinc-400 font-medium italic">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                Reservado: {block.startTime} às {block.endTime}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita (Recorrência) */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0 pr-10 md:pr-12">
          {(block.recurringType === BlockRecurringTypeEnum.DAILY || block.recurringType === BlockRecurringTypeEnum.WEEKLY) && (
            <div className="flex items-center gap-1.5 bg-zinc-100 text-zinc-500 px-2 md:px-3 py-1 rounded-md border border-zinc-200">
              <FaRepeat className="text-[9px] md:text-[10px]" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                {block.recurringTypeFormatted}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu flutuante */}
      <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10">
        <BlockMenu block={block as any} />
      </div>
    </Card>
  )
}