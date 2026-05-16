"use client"

import Link from "next/link"
import { ChangeEvent, useState } from "react"
import { addMonths } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { FaCalendarPlus, FaTableCellsRowLock, FaLock, FaMagnifyingGlass } from "react-icons/fa6"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ScheduleStatusEnum } from "@/commons/enums/schedule"
import { ScheduleFilters } from "@/commons/models/schedule"
import { FilterItem } from "@/components/inputs/filter"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BlockTimeForm } from "@/components/forms/block-time-form"

interface NavCalendarProps {
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
  filters: ScheduleFilters
  onFilterChange: (filters: ScheduleFilters) => void
}

export function NavCalendar({ selectedDate, onSelectDate, filters, onFilterChange }: NavCalendarProps) {
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const maxDate = addMonths(new Date(), 3)

  const toggleStatus = (status: number) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: newStatuses });
  };

  const toggleHighlight = (highlight: string) => {
    const newHighlights = filters.highlights.includes(highlight)
      ? filters.highlights.filter(h => h !== highlight)
      : [...filters.highlights, highlight];
    onFilterChange({ ...filters, highlights: newHighlights });
  };

  const toggleShowBlocks = () => {
    onFilterChange({ ...filters, showBlocks: !filters.showBlocks });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  return (
    <aside className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* 1. Cabeçalho / Calendário */}
      <div className="p-4 md:p-6 pb-2 shrink-0 border-b border-purple-50/50">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={{ after: maxDate }}
          className="w-full flex justify-center p-0 bg-transparent"
          classNames={{
            month_caption: "flex justify-center items-center h-10 w-full text-purple-900 font-bold px-10 mb-4 uppercase",
            nav: "flex items-center justify-between absolute w-full inset-x-0 z-10 px-2",
            button_previous: "h-9 w-9 text-purple-600 hover:bg-purple-100 rounded-md transition-all flex items-center justify-center",
            button_next: "h-9 w-9 text-purple-600 hover:bg-purple-100 rounded-md transition-all flex items-center justify-center",
            table: "w-full border-collapse",
            weekdays: "flex w-full mb-3",
            weekday: "text-purple-400 font-bold text-[10px] uppercase tracking-[0.2em] flex-1 text-center h-8 flex items-center justify-center",
            week: "flex w-full mt-1.5",
            day: "relative flex-1 aspect-square p-0 flex items-center justify-center group",
            selected: "bg-purple-600 text-white hover:bg-purple-700 focus:bg-purple-600 rounded-md font-bold shadow-md shadow-purple-100 scale-95 transition-all",
            today: "bg-purple-50 text-purple-700 font-bold rounded-md border border-purple-100",
            outside: "text-gray-200 opacity-50",
            day_button: "w-full h-full rounded-md flex items-center justify-center text-sm transition-all hover:bg-purple-50 hover:text-purple-700",
          }}
        />
      </div>

      {/* 2. Área de Filtros (Rolável apenas se necessário) */}
      <ScrollArea className="flex-1 min-h-0 bg-purple-50/10">
        <div className="p-5 md:p-6 space-y-8">

          {/* Busca */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Busca</h4>
              <span className="h-px flex-1 bg-purple-100/50 ml-3" />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMagnifyingGlass className="text-purple-300" />
              </div>
              <Input
                placeholder="Buscar cliente ou procedimento..."
                className="pl-9 bg-white border-purple-100 focus-visible:ring-purple-600/20 focus-visible:border-purple-600 text-purple-900 placeholder:text-purple-300 shadow-sm"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
          </section>

          {/* Status do Atendimento */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Status da Agenda</h4>
              <span className="h-px flex-1 bg-purple-100/50 ml-3" />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <FilterItem
                label="Confirmados"
                id="st-confirmed"
                checked={filters.statuses.includes(ScheduleStatusEnum.CONFIRMED)}
                onChange={() => toggleStatus(ScheduleStatusEnum.CONFIRMED)}
                color="bg-purple-600"
              />
              <FilterItem
                label="Pendentes"
                id="st-pending"
                checked={filters.statuses.includes(ScheduleStatusEnum.PENDING)}
                onChange={() => toggleStatus(ScheduleStatusEnum.PENDING)}
                color="bg-purple-600"
              />
              <FilterItem
                label="Finalizados"
                id="st-completed"
                checked={filters.statuses.includes(ScheduleStatusEnum.COMPLETED)}
                onChange={() => toggleStatus(ScheduleStatusEnum.COMPLETED)}
                color="bg-purple-600"
              />
              <FilterItem
                label="Cancelados"
                id="st-cancelled"
                checked={filters.statuses.includes(ScheduleStatusEnum.CANCELLED)}
                onChange={() => toggleStatus(ScheduleStatusEnum.CANCELLED)}
                color="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                activeClass="bg-red-50/50 border-red-200 text-red-900"
                hoverClass="hover:border-red-100"
                labelClass="text-red-500"
              />
            </div>
          </section>

          {/* Destaques do Dia */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Destaques</h4>
              <span className="h-px flex-1 bg-purple-100/50 ml-3" />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <FilterItem
                label="Novas Poderosas"
                id="hl-new"
                checked={filters.highlights.includes('new')}
                onChange={() => toggleHighlight('new')}
              />
              <FilterItem
                label="Aniversariantes"
                id="hl-birthday"
                checked={filters.highlights.includes('birthday')}
                onChange={() => toggleHighlight('birthday')}
              />
              <FilterItem
                label="Horários Bloqueados"
                id="hl-blocks"
                checked={filters.showBlocks}
                onChange={toggleShowBlocks}
                color="data-[state=checked]:bg-zinc-500 data-[state=checked]:border-zinc-500"
                activeClass="bg-zinc-50 border-zinc-200 text-zinc-900"
                hoverClass="hover:border-zinc-200"
                labelClass="text-zinc-600"
              />
            </div>
          </section>

        </div>
      </ScrollArea>

      {/* 3. Rodapé / Ações */}
      <div className="p-6 bg-white border-t border-purple-100 flex flex-col gap-3 shrink-0">
        <Button asChild variant="default" size="lg" className="w-full justify-center gap-3 h-12 bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md shadow-purple-100 rounded-md transition-all group font-bold">
          <Link href="/painel/agenda/atendimento/novo">
            <FaCalendarPlus className="text-white/90 group-hover:scale-110 transition-transform text-lg" />
            Novo Atendimento
          </Link>
        </Button>
        <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="lg" className="w-full justify-center gap-3 h-12 bg-white hover:bg-purple-50 text-purple-700 border-purple-100 shadow-sm rounded-md transition-all font-bold">
              <FaTableCellsRowLock className="text-purple-400 text-lg" />
              Bloquear Horário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-purple-100 bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-purple-900 font-black text-xl">
                <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <FaLock className="text-sm" />
                </div>
                Bloquear Horário
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-xs">
                Escolha um motivo e o período para pausar os atendimentos.
              </DialogDescription>
            </DialogHeader>
            <BlockTimeForm
              selectedDate={selectedDate || new Date()}
              onSuccess={() => setIsBlockDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  )
}
