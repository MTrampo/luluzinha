"use client"

import { useState } from "react"
import { addDays, addMonths } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { type DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { FaCalendarDays, FaCalendarPlus, FaTableCellsRowLock } from "react-icons/fa6"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"

export function NavCalendar() {
  const today = new Date()
  const [range, setRange] = useState<DateRange | undefined>({
    from: today,
    to: today,
  })
  const [checked, setChecked] = useState(false)

  // limite máximo: 3 meses à frente a partir de hoje
  const maxDate = addMonths(new Date(), 1)
  const specialDays = [addDays(today, 2), addDays(today, 8)]

  return (
    <aside className="fixed top-16 right-0 bottom-0 w-3/4 sm:max-w-sm bg-sidebar border-l border-gray-300 overflow-auto">
      <Calendar
        mode="range"
        modifiers={{ highlighted: specialDays,  }} //exemplo de dias bloqueados ou especiais ou vagos
        modifiersClassNames={{ highlighted: "bg-red-100 text-red-900 rounded-md" }} //exemplo de dias bloqueados
        defaultMonth={range?.from}
        selected={range}
        onSelect={setRange}
        // desabilita seleções após `maxDate` e limita a navegação com `endMonth`
        disabled={{ after: maxDate }}
        endMonth={maxDate}
        className="w-full"
      />
      <div className="p-4">
        <small className="text-xs text-gray-400 tracking-tight">
          Selecione um período de datas ou clique duas vezes em uma data para definir o início e fim do período.
        </small>
      </div>
      <div className="border-t p-4">
        <Accordion
          type="multiple"
          className="max-w-lg"
        >
          <AccordionItem value="option 1">
            <AccordionTrigger className="p-0">Minha agenda</AccordionTrigger>
            <AccordionContent>
              <FieldGroup className="max-w-sm gap-3 mt-4">
                <Field orientation="horizontal">
                  <Checkbox id="terms-checkbox" name="terms-checkbox" />
                  <FieldContent>
                    <FieldLabel htmlFor="terms-checkbox-2">
                      Destacar bloqueados
                    </FieldLabel>
                  </FieldContent>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="terms-checkbox-2"
                    name="terms-checkbox-2"
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="terms-checkbox-2">
                      Destacar disponíveis
                    </FieldLabel>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="border-t p-4">
        <Button variant='menu' size='sm'>
          <FaCalendarPlus />
          Novo Agendamento 
        </Button>
        <Button variant='menu' size='sm'>
          <FaTableCellsRowLock />
          Bloquear período
        </Button>
      </div>
    </aside>
  )
}

