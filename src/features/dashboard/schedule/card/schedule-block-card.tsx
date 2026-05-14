import { FaClock, FaLock } from "react-icons/fa6";

export function ScheduleBlockCard({ block }: { block: any }) {
  return (
    <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-md p-4 flex items-center justify-between group hover:border-purple-200 transition-colors">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
          <FaLock className="text-sm" />
        </div>
        <div>
          <h5 className="text-sm font-bold text-gray-500 group-hover:text-purple-900 transition-colors">
            Bloqueado: {block.reason || "Sem motivo"}
          </h5>
          <div className="flex items-center gap-2 mt-0.5">
            <FaClock className="text-[10px] text-gray-400" />
            <span className="text-[11px] text-gray-400 font-medium">
              {block.start_time.substring(0, 5)} até {block.end_time.substring(0, 5)}
            </span>
          </div>
        </div>
      </div>

      {block.day_of_week !== null && (
        <div className="text-[10px] bg-white border border-gray-100 text-gray-400 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
          Recorrente
        </div>
      )}
    </div>
  )
}