"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDateInput, isIsoDateString, parseDateInput, toIsoDateInput } from "@/commons/utils/format"

interface DatePickerFieldProps {
  field: any
  fieldState: any
  label: string
  id: string
  placeholder?: string
}

export function DatePickerField({ field, fieldState, label, id, placeholder = "DD/MM/AAAA" }: DatePickerFieldProps) {
  const isIso = isIsoDateString(field.value);
  const dateValue = isIso ? new Date(field.value + 'T12:00:00Z') : undefined
  const [inputValue, setInputValue] = useState(formatDateInput(dateValue))
  const [openCalendar, setOpenCalendar] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(dateValue || new Date())

  useEffect(() => {
    if (field.value) {
      if (isIsoDateString(field.value)) {
        setInputValue(formatDateInput(new Date(field.value + 'T12:00:00Z')))
      } else {
        setInputValue(field.value)
      }
    } else {
      setInputValue("")
    }
  }, [field.value])

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id={id}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value
            setInputValue(val)
            const d = parseDateInput(val)
            if (d) {
              field.onChange(toIsoDateInput(d))
              setCalendarMonth(d)
            } else {
              field.onChange(val)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpenCalendar(true)
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label="Selecionar data"
              >
                <CalendarIcon />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={dateValue}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                onSelect={(date) => {
                  if (date) {
                    field.onChange(toIsoDateInput(date))
                    setInputValue(formatDateInput(date))
                  } else {
                    field.onChange("")
                    setInputValue("")
                  }
                  setOpenCalendar(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )
}
