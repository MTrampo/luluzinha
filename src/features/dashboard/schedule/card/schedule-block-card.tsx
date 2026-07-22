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
      "relative flex flex-row items-stretch gap-0 p-0 overflow-hidden border-zinc-100 min-h-24 w-full bg-zinc-50/60 rounded-md",
      "border-l-4 border-zinc-400 shadow-sm"
    )}>

      {/* Coluna do Horário (Esquerda) */}
      <div className="flex flex-col items-center justify-center w-20 sm:w-24 lg:w-32 border-r border-dashed border-zinc-200 shrink-0 bg-zinc-100/10">
        <span className="text-sm sm:text-base lg:text-xl font-black text-zinc-500 leading-none">
          {block.isAllDay ? "24h" : block.startTime}
        </span>
        <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs text-zinc-400 font-medium tracking-tight">
          <FaClock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>{block.durationFormatted}</span>
        </div>
      </div>

      {/* Bloco de Conteúdo (Direita) */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-0 sm:px-4 lg:px-6 gap-2 sm:gap-4">
        {/* Informações do Bloqueio */}
        <div className="flex items-center gap-2 lg:gap-4 min-w-0">
          <div className="h-8 w-8 lg:h-11 lg:w-11 rounded-full bg-white flex items-center justify-center text-zinc-400 border border-zinc-200 shadow-sm shrink-0">
            {getBlockIcon(block.reason)}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs sm:text-sm lg:text-base text-zinc-600 truncate max-w-35 sm:max-w-none">
              {block.reason}
            </span>
            {!block.isAllDay && (
              <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-zinc-400 font-medium italic mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                Reservado: {block.startTime} às {block.endTime}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita (Recorrência) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0 pr-8 sm:pr-10 lg:pr-12">
          {(block.recurringType === BlockRecurringTypeEnum.DAILY || block.recurringType === BlockRecurringTypeEnum.WEEKLY) && (
            <div className="flex items-center gap-1.5 bg-zinc-100 text-zinc-500 px-2 lg:px-3 py-1 rounded-md border border-zinc-200">
              <FaRepeat className="text-[9px] lg:text-[10px]" />
              <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                {block.recurringTypeFormatted}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Menu flutuante */}
      <div className="absolute right-2 sm:right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10">
        <BlockMenu block={block} />
      </div>
    </Card>
  )
}