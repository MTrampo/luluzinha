"use client"

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProcedureFormatted } from "@/commons/models/procedure";
import { cn } from "@/commons/lib/tw-merge";
import { Checkbox } from "@/components/ui/checkbox";
import { FaClock } from "react-icons/fa6";
import { SearchInput } from "@/components/inputs/search";

export function SelectProceduresForm({
  procedures,
  onSelect,
  initialSelected = []
}: {
  procedures: ProcedureFormatted[];
  onSelect?: (ids: string[]) => void;
  initialSelected?: string[];
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get('q') || "";

  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);

  const filteredProcedures = useMemo(() => {
    return procedures.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [procedures, search]);

  const toggleSelection = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(pId => pId !== id)
      : [...selectedIds, id];

    setSelectedIds(newSelection);
    if (onSelect) onSelect(newSelection);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <SearchInput placeholder="Pesquisar procedimento..." />
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 ">
        {filteredProcedures.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-medium">
            Nenhum procedimento encontrado.
            <br />
            <span className="text-sm text-gray-400">Tente buscar por outro nome ou cadastre novos procedimentos.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredProcedures.map((procedure) => {
              const isSelected = selectedIds.includes(procedure.id);

              return (
                <label
                  key={procedure.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all relative hover:shadow-md duration-300",
                    isSelected
                      ? "border-purple-600 bg-purple-50 shadow-md"
                      : "border-purple-100/50 bg-white hover:bg-purple-50 hover:border-purple-200"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelection(procedure.id)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 ml-1"
                  />

                  <div className="flex flex-col overflow-hidden flex-1 ml-1">
                    <span className="font-bold text-gray-800 truncate text-[0.95rem] capitalize">
                      {procedure.name}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 mt-0.5 flex gap-1 items-center">
                      <FaClock /> {procedure.durationFormatted}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center justify-center pr-2">
                    <span className={cn(
                      "font-black text-[0.95rem]",
                      isSelected ? "text-purple-700" : "text-gray-700"
                    )}>
                      {procedure.priceFormatted}
                    </span>
                  </div>
                </label>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
