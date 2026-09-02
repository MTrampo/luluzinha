"use client"

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerFormatted } from "@/commons/models/customer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { StandardAvatar } from "@/components/avatar";
import { SearchInput } from "@/components/inputs/search";
import { cn } from "@/commons/lib/tw-merge";
import { FaCircleCheck } from "react-icons/fa6";

export function SelectCustomerForm({
  customers,
  onSelect,
  initialSelectedId
}: {
  customers: CustomerFormatted[];
  onSelect?: (id: string) => void;
  initialSelectedId?: string;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get('q') || "";

  const [selectedId, setSelectedId] = useState<string | undefined>(initialSelectedId);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
    );
  }, [customers, search]);

  const handleSelect = (val: string) => {
    setSelectedId(val);
    if (onSelect) onSelect(val);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <SearchInput placeholder="Pesquisar por nome ou celular..." />
      </div>

      <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-1 sm:pr-2">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-medium">
            Nenhuma poderosa encontrada.
            <br />
            <span className="text-sm text-gray-400">Tente buscar por outro nome ou cadastre uma nova.</span>
          </div>
        ) : (
          <RadioGroup value={selectedId} onValueChange={handleSelect} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-2">
            {filteredCustomers.map((customer) => (
              <div key={customer.id}>
                <Label
                  htmlFor={customer.id}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 cursor-pointer relative group",
                    selectedId === customer.id
                      ? "border-purple-600 bg-purple-50/80 shadow-md"
                      : "border-purple-100/50 bg-white hover:border-purple-200 hover:bg-purple-50/30 shadow-sm hover:shadow-md"
                  )}
                >
                  <RadioGroupItem value={customer.id} id={customer.id} className="sr-only" />

                  <div className="relative">
                    <StandardAvatar initials={customer.initials} className="h-12 w-12 border-2 border-white shadow-sm" />
                    {selectedId === customer.id && (
                      <div className="absolute -top-1 -right-1 text-purple-600 bg-white rounded-full shadow-sm">
                        <FaCircleCheck size={18} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={cn(
                      "font-bold truncate text-sm md:text-base transition-colors",
                      selectedId === customer.id ? "text-purple-900" : "text-gray-800"
                    )}>
                      {customer.nameFormatted}
                    </span>
                    <span className={cn(
                      "text-xs font-semibold truncate",
                      selectedId === customer.id ? "text-purple-600" : "text-gray-500"
                    )}>
                      {customer.phoneFormatted || "Sem telefone"}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </div>
  )
}
