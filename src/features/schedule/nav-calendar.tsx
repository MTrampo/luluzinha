"use client"

import { addMonths } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { FaCalendarPlus, FaTableCellsRowLock } from "react-icons/fa6"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavCalendarProps {
  selectedDate: Date | undefined
  onSelectDate: (date: Date | undefined) => void
}

export function NavCalendar({ selectedDate, onSelectDate }: NavCalendarProps) {
  const maxDate = addMonths(new Date(), 3)

  return (
    <aside className="w-full flex flex-col h-full bg-white">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6">
          <div className="mb-6 lg:hidden">
            <h3 className="text-xl font-black text-purple-900 leading-tight">Agenda de Ciclos</h3>
            <p className="text-xs text-gray-500 mt-1 font-medium">Toque em uma data para organizar sua bancada.</p>
          </div>

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

        <div className="px-6 py-2">
          <div className="bg-purple-50/50 rounded-md p-3 border border-purple-100/30">
            <small className="text-[10px] text-purple-600/70 leading-tight block text-center font-semibold">
              Explore o futuro do seu sucesso em cada clique.
            </small>
          </div>
        </div>

        <div className="p-4 md:p-6 mt-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters" className="border-none">
              <AccordionTrigger className="py-3 text-sm font-semibold text-purple-900 hover:no-underline px-4 bg-purple-50/30 hover:bg-purple-50/80 rounded-md transition-all">
                Filtros da Bancada
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4 pb-2">
                <FieldGroup className="gap-4">
                  <Field orientation="horizontal" className="justify-between">
                    <FieldLabel htmlFor="show-blocked" className="text-xs font-semibold text-gray-600">Horários Bloqueados</FieldLabel>
                    <Checkbox id="show-blocked" className="h-5 w-5 border-purple-200 rounded-md data-[state=checked]:bg-purple-600" />
                  </Field>
                  <Field orientation="horizontal" className="justify-between">
                    <FieldLabel htmlFor="show-available" className="text-xs font-semibold text-gray-600">Horários Disponíveis</FieldLabel>
                    <Checkbox id="show-available" className="h-5 w-5 border-purple-200 rounded-md data-[state=checked]:bg-purple-600" />
                  </Field>
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>

      <div className="p-6 bg-transparent lg:border-t-0 border-t border-purple-100 flex flex-col gap-3 shrink-0">
        <Button variant="default" size="lg" className="w-full justify-center gap-3 h-12 bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md shadow-purple-100 rounded-md transition-all group font-bold">
          <FaCalendarPlus className="text-white/90 group-hover:scale-110 transition-transform text-lg" />
          Novo Ciclo
        </Button>
        <Button variant="outline" size="lg" className="w-full justify-center gap-3 h-12 bg-white hover:bg-purple-50 text-purple-700 border-purple-100 shadow-sm rounded-md transition-all font-bold">
          <FaTableCellsRowLock className="text-purple-400 text-lg" />
          Bloquear Horário
        </Button>
      </div>
    </aside>
  )
}

